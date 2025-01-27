// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::process::Command;
use tauri::command;

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_exe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
