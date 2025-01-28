<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "../../stores/authStore";
  import { ROUTES } from "../../config/constants";
  import Navbar from "$lib/components/Navbar.svelte";
  import type { User } from "$lib/types/user";

  $: user = $authStore.user as User;
  $: isAuthenticated = $authStore.isAuthenticated;
  let isDownloaded = false;

  onMount(async () => {
    // Initialize auth store
    authStore.initialize();

    // Check authentication
    if (!isAuthenticated || !$authStore.user) {
      goto(ROUTES.LOGIN);
    } else {
      console.log(user.userId);

      // Kontrola, zda je hra již stažena
      const response = await fetch(
        `http://localhost:3000/api/games/library/check/${user.userId}/1`,
        {
          headers: {
            Authorization: `Bearer ${$authStore.token}`,
          },
        }
      );
      const data = await response.json();
      isDownloaded = data.exists;
    }
  });

  async function downloadGame(userId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/games/download/${userId}/1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${$authStore.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Chyba: ${errorData.message}`);
        return;
      }

      // Stažení souboru
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Game1.exe";
      link.click();

      const check = await fetch(
        `http://localhost:3000/api/games/library/check/${user.userId}/1`,
        {
          headers: {
            Authorization: `Bearer ${$authStore.token}`,
          },
        }
      );
      const data = await check.json();
      isDownloaded = data.exists;
    } catch (error) {
      console.error(error);
      alert("Chyba při stahování hry.");
    }
  }
</script>

<div class="container">
  <h1 class="text-white">GAME 1: Shadow Quest</h1>
  <p class="text-gray-300">
    Step into the mysterious world of Shadow Quest, an action-packed RPG where
    you uncover ancient secrets, battle shadowy foes, and forge alliances to
    save a crumbling kingdom. Explore a richly detailed open world, master
    unique abilities, and make choices that shape your destiny. Will you embrace
    the light or succumb to the shadows? The choice is yours..
  </p>

  {#if isDownloaded}
    <button disabled class="button start"> Downloaded </button>
  {:else}
    <button on:click={() => downloadGame(user.userId)} class="button download">
      Download
    </button>
  {/if}

  <button on:click={() => window.history.back()} class="button back">
    Back
  </button>
</div>

<style>
  .button {
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  .download {
    background-color: #1d4ed8;
    color: white;
    border: none;
  }
  .start {
    background-color: #10b981;
    color: white;
    border: none;
    cursor: default;
  }
  .back {
    background-color: #6b7280;
    color: white;
    border: none;
  }
  .button:hover {
    opacity: 0.9;
  }
  .button.start:hover {
    opacity: 1;
  }
  p {
    text-align: center;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 50px;
  }
</style>
