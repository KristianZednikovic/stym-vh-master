<script>
  let isDownloaded = false;
  let isAuthenticated = false;

  async function verifyUser() {
    try {
      const response = await fetch('http://localhost:8080/api/verify-user', {
        credentials: 'include' // Pro přenos cookies nebo tokenu
      });

      if (response.ok) {
        const data = await response.json();
        isAuthenticated = data.status === 'authenticated';
      } else {
        isAuthenticated = false;
      }
    } catch (error) {
      console.error('Chyba při ověřování uživatele:', error);
      isAuthenticated = false;
    }
  }

  async function downloadGame() {
    await verifyUser(); // Ověř, zda je uživatel přihlášen

    if (isAuthenticated) {
      try {
        const response = await fetch('http://localhost:8080/api/download-game', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          // Stažení souboru
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'game-file.zip';
          document.body.appendChild(a);
          a.click();
          a.remove();
          isDownloaded = true;
          alert('Hra byla stažena!');
        } else {
          alert('Stahování selhalo. Nejste přihlášen.');
        }
      } catch (error) {
        console.error('Chyba při stahování souboru:', error);
      }
    } else {
      alert('Musíte být přihlášeni k účtu.');
    }
  }

  async function startGame() {
    await verifyUser(); // Ověř uživatele před spuštěním hry

    if (isAuthenticated && isDownloaded) {
      alert('Hra spuštěna!');
    } else if (!isAuthenticated) {
      alert('Musíte být přihlášeni a online.');
    } else {
      alert('Hru je třeba nejdříve stáhnout.');
    }
  }
</script>

<h1 class="text-white">Hra 2</h1>
<p class="text-gray-300">Tato hra je připravena ke stažení a spuštění.</p>

<!-- Podmíněné tlačítko pro stažení nebo spuštění -->
{#if isDownloaded}
  <button on:click={startGame} class="bg-green-500 text-white px-4 py-2 rounded">
    Spustit Hru 2
  </button>
{:else}
  <button on:click={downloadGame} class="bg-blue-500 text-white px-4 py-2 rounded">
    Stáhnout Hru 2
  </button>
{/if}

<!-- Tlačítko zpět -->
<div class="mt-4">
  <button on:click={() => window.history.back()} class="bg-gray-500 text-white px-4 py-2 rounded">
    Zpět
  </button>
</div>
