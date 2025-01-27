<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "../../../stores/authStore";
  import { ROUTES } from "../../../config/constants";
  import { core } from "@tauri-apps/api";

  import Navbar from "$lib/components/Navbar.svelte";

  let userGames = [];
  $: user = $authStore.user;
  $: isAuthenticated = $authStore.isAuthenticated;

  async function fetchUserGames(userId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/games/library/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        userGames = data;
      } else {
        console.error("Failed to fetch user library.");
      }
    } catch (error) {
      console.error("Error fetching user games:", error);
    }
  }

  async function uninstallGame(gameId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/games/uninstall/${user.userId}/${gameId}`,
        {
          method: "DELETE",
        }
      );
      if (response) {
        userGames = userGames.filter((game) => game.id !== gameId);
        fetchUserGames(user.userId);
      } else {
        console.error("Failed to uninstall game.");
      }
    } catch (error) {
      console.error("Error uninstalling game:", error);
    }
  }
  // async function launchExe() {
  //   try {
  //     await core.invoke("run_exe", {
  //       exePath: "C:\\Users\\test\\Downloads\\Game1.exe",
  //     });
  //     console.log("Spouštím Game1.exe");
  //   } catch (error) {
  //     console.error("Nepodařilo se spustit exe:", error);
  //     alert(`Chyba: ${error}`);
  //   }
  // }
  onMount(() => {
    // Initialize auth store
    authStore.initialize();

    // Check authentication
    if (!isAuthenticated) {
      goto(ROUTES.LOGIN);
    } else {
      // Fetch user's games
      fetchUserGames(user.userId);
    }
  });

  async function launchExe(gameId: number) {
    try {
      // Ověř, zda má uživatel platný klíč
      const response = await fetch(
        `http://localhost:3000/api/games/library/verify/${user.userId}/${gameId}`
      );

      if (!response.ok) {
        throw new Error("Licence nebyla nalezena nebo je neplatná.");
      }

      const { gameKey } = await response.json();

      // Pokud je licence platná, spusť hru
      console.log(`Licence ověřena: ${gameKey}. Spouštím hru.`);
      await core.invoke("run_exe", {
        exePath: "C:\\Users\\test\\Downloads\\Game1.exe",
      });
    } catch (error) {
      console.error("Nepodařilo se spustit exe:", error);
      alert(`Chyba: ${error.message}`);
    }
  }
</script>

<main class="min-h-screen bg-gray-800 p-4">
  <!-- Top Navigation Bar -->
  <Navbar />

  <!-- Main Content -->
  <div class="max-w-6xl mx-auto mt-24">
    <h1 class="text-2xl font-bold text-white">Your Library</h1>

    <ul class="mt-4">
      {#each userGames as game}
        <li
          class="game-box text-white p-2 border border-gray-700 rounded mt-2 text-white"
        >
          <p class="game-title">{game.game_title}</p>
          <div class="manage">
            <button on:click={() => launchExe(game.game_id)} class="button run">
              Start the game
            </button>
            <button
              on:click={() => uninstallGame(game.game_id)}
              class="button uninstall"
            >
              Uninstall
            </button>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  .uninstall {
    background: red;
    color: #fff;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
  }
  .uninstall:hover {
    opacity: 0.9;
  }
  .run {
    background: rgb(0, 85, 255);
    color: #fff;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
  }
  .run:hover {
    opacity: 0.9;
  }
  .game-title {
    margin-bottom: 10px;
    font-size: 21px;
  }
  .game-box {
    padding: 20px;
    background: color(srgb 0.0644 0.095 0.1537);
  }
  .manage {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 11px;
  }
</style>
