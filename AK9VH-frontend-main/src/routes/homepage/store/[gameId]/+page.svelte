<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { authStore } from '../../../../stores/authStore';
    import { ROUTES } from '$config/constants'; // Make sure this import path is correct
    import Navbar from '$lib/components/Navbar.svelte';
    import type { User } from '$lib/types/user';

    $: user = $authStore.user as User;
    $: isAuthenticated = $authStore.isAuthenticated;

    const gameId = $page.params.gameId;
    let game: any = null; // Use a proper Game type if you have one
    let isDownloaded = false;

    onMount(async () => {
        authStore.initialize();

        if (!isAuthenticated || !$authStore.user) {
            goto(ROUTES.LOGIN);
        } else {
            // Fetch game data based on gameId
            try {
                const gameResponse = await fetch(
                    `http://localhost:3000/api/games/${gameId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${$authStore.token}`,
                        },
                    }
                );

                if (gameResponse.ok) {
                    game = await gameResponse.json();
                } else {
                    console.error(
                        'Failed to fetch game data:',
                        await gameResponse.text()
                    );
                    goto(ROUTES.STORE); // Redirect to store if game not found or error
                    return;
                }

                // Check if game is downloaded
                const libraryResponse = await fetch(
                    `http://localhost:3000/api/games/library/check/${user.userId}/${gameId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${$authStore.token}`,
                        },
                    }
                );
                const libraryData = await libraryResponse.json();
                isDownloaded = libraryData.exists;
            } catch (error) {
                console.error('Error:', error);
                // Handle errors, maybe display an error message
            }
        }
    });

    async function downloadGame(userId: number, gameId: number) {
        try {
            const response = await fetch(
                `http://localhost:3000/api/games/download/${userId}/${gameId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${$authStore.token}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            // File download
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${game.title}.exe`;
            link.click();

            // Check again if game is downloaded
            const check = await fetch(
                `http://localhost:3000/api/games/library/check/${user.userId}/${gameId}`,
                {
                    headers: {
                        Authorization: `Bearer ${$authStore.token}`
                    }
                }
            );
            const data = await check.json();
            isDownloaded = data.exists;

        } catch (error) {
            console.error(error);
            alert('Error while downloading.');
        }
    }

    async function uninstallGame(userId: number, gameId: number) {
        try {
            const response = await fetch(
                `http://localhost:3000/api/games/uninstall/${userId}/${gameId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${$authStore.token}`,
                    },
                }
            );
            if (response.ok) {
                isDownloaded = false;
                alert('Game uninstalled successfully.');
            } else {
                console.error('Failed to uninstall game.');
            }
        } catch (error) {
            console.error('Error uninstalling game:', error);
        }
    }
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <Navbar />

    <div class="max-w-4xl mx-auto mt-24">
        {#if game}
            <div class="bg-gray-900 rounded-lg shadow-xl p-8">
                <div class="flex justify-center mb-8">
                    <img src="https://dummyimage.com/400x400" alt="{game.title}" class="w-full max-h-96 object-contain rounded-lg" />
                </div>
                <h1 class="text-4xl font-bold text-white text-center mb-4">{game.title}</h1>
                <p class="text-gray-300 text-center mb-8">{game.description}</p>

                <div class="flex justify-center gap-4">
                    {#if isDownloaded}
                        <button
                                on:click={() => uninstallGame(user.userId, game.id)}
                                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-48"
                        >
                            Uninstall
                        </button>
                    {:else}
                        <button
                                on:click={() => downloadGame(user.userId, game.id)}
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48"
                        >
                            Download
                        </button>
                    {/if}
                </div>
            </div>
        {:else}
            <p class="text-gray-300 text-center">Loading game data...</p>
        {/if}
    </div>
</main>