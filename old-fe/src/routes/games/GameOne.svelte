<script>
  import { onMount } from "svelte";

  let isAuthenticated = false;
  let isDownloaded = false;
  let gameId = 1; // pro ukázku

  // Ověření uživatele při načtení komponenty
  async function verifyUser() {
    try {
      const response = await fetch("http://localhost:3000/api/verify-user", {
        credentials: "include", // Zajistí přenos cookies nebo tokenu
      });

      if (response.ok) {
        const data = await response.json();
        isAuthenticated = data.status === "authenticated";
      } else {
        isAuthenticated = false;
      }
    } catch (error) {
      console.error("Chyba při ověřování uživatele:", error);
      isAuthenticated = false;
    }
  }

  // Spustí se při načtení komponenty
  onMount(() => {
    verifyUser();
  });

  // Stažení hry
  async function downloadGame() {
    // Nejdřív si ověříme, zda je uživatel aktuálně přihlášen
    await verifyUser();

    if (isAuthenticated) {
      try {
        const response = await fetch(`http://localhost:3000/api/games/download/${gameId}`, {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          // Název souboru si převezmeme z backendu, nebo ho pojmenujte staticky
          a.download = `Game${gameId}.exe`; 
          document.body.appendChild(a);
          a.click();
          a.remove();

          isDownloaded = true;
          alert("Hra byla úspěšně stažena!");
        } else {
          alert("Stahování selhalo nebo nejste přihlášeni.");
        }
      } catch (error) {
        console.error("Chyba při stahování hry:", error);
        alert("Došlo k chybě při stahování hry.");
      }
    } else {
      alert("Musíte být přihlášeni k účtu.");
    }
  }

  // Spuštění hry (ukázka)
  async function startGame() {
    await verifyUser();

    if (isAuthenticated && isDownloaded) {
      alert("Hra spuštěna!");
    } else if (!isAuthenticated) {
      alert("Musíte být přihlášeni a online.");
    } else {
      alert("Hru je třeba nejdříve stáhnout.");
    }
  }
</script>

<style>
  .button { padding: 10px 20px; border-radius: 5px; font-size: 16px; cursor: pointer; }
  .download { background-color: #1d4ed8; color: white; border: none; }
  .start { background-color: #10b981; color: white; border: none; }
  .back { background-color: #6b7280; color: white; border: none; }
  .button:hover { opacity: 0.9; }
  .container { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-top: 50px; }
</style>

<div class="container">
  <h1 class="text-white">Hra {gameId}</h1>
  <p class="text-gray-300">Tato hra je připravena ke stažení a spuštění.</p>

  {#if isDownloaded}
    <button on:click={startGame} class="button start">
      Spustit Hru {gameId}
    </button>
  {:else}
    <button on:click={downloadGame} class="button download">
      Stáhnout Hru {gameId}
    </button>
  {/if}

  <button on:click={() => window.history.back()} class="button back">
    Zpět
  </button>
</div>
