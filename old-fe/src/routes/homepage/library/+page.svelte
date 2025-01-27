<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '../../../stores/authStore';
  import Navbar from '$lib/components/Navbar.svelte';

  let games = [];
  let isAuthenticated = false;

  $: user = $authStore.user;

  onMount(async () => {
    // Ověření uživatele
    isAuthenticated = $authStore.isAuthenticated;

    if (!isAuthenticated) {
      goto('/login'); // Přesměrování na přihlašovací stránku
    } else {
      await fetchGames();
    }
  });

  async function fetchGames() {
    try {
      const response = await fetch('http://localhost:8080/api/games', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${$authStore.token}`,
        },
      });

      if (response.ok) {
        games = await response.json();
      } else {
        console.error('Chyba při načítání her:', await response.text());
      }
    } catch (err) {
      console.error('Chyba:', err);
    }
  }

  async function startGame(gameId) {
    try {
      const response = await fetch(`http://localhost:8080/api/verify-license?gameId=${gameId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${$authStore.token}`,
        },
      });

      if (response.ok) {
        alert('Hra spuštěna!');
      } else {
        alert('Nelze spustit hru. Licence není platná.');
      }
    } catch (err) {
      console.error('Chyba při spouštění hry:', err);
    }
  }
</script>

<main class="min-h-screen bg-gray-800 text-white p-4">
  <Navbar />

  <div class="max-w-6xl mx-auto mt-24">

  <h1 class="text-2xl mb-4">Vaše Hry</h1>

  {#if games.length > 0}
    <ul>
      {#each games as game}
        <li class="mb-4">
          <h2 class="text-xl font-bold">Hra ID: {game.game_id}</h2>
          <p>Licence: {game.license ? 'Platná' : 'Neplatná'}</p>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            on:click={() => startGame(game.game_id)}
          >
            Spustit Hru
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>Nemáte žádné hry.</p>
  {/if}
</main>
