// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::process::Command;
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[tauri::command]
async fn get_downloads_dir() -> Result<String, String> {
    match dirs::download_dir() {
        Some(path) => Ok(path.to_string_lossy().into()),
        None => Err("Could not get downloads directory".into()),
    }
}

#[tauri::command]
async fn get_documents_dir() -> Result<String, String> {
    match dirs::document_dir() {
        Some(path) => Ok(path.to_string_lossy().into()),
        None => Err("Could not get documents directory".into()),
    }
}

// Command, který spustí daný exe soubor
#[command]
fn run_exe(exe_path: &str) -> Result<(), String> {
    // Pokusíme se spustit .exe
    match Command::new(exe_path).spawn() {
        Ok(_child) => {
            // Úspěšné spuštění
            Ok(())
        }
        Err(e) => {
            // Nepodařilo se spustit
            Err(format!("Chyba při spouštění programu: {}", e))
        }
    }
}

#[tauri::command]
async fn create_stym_dir(documents_dir: String) -> Result<(), String> {
    let stym_path = PathBuf::from(documents_dir).join("Stym");

    if !stym_path.exists() {
        match fs::create_dir_all(&stym_path) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to create Stym directory: {}", e)),
        }
    } else {
        Ok(())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            run_exe,
            get_downloads_dir,
            get_documents_dir,
            create_stym_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
