<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { authStore } from '../../stores/authStore';
    import { ROUTES } from '../../config/constants';
    import Navbar from '$lib/components/Navbar.svelte';
    import type { Game } from '$lib/types/game';

    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;

    let recentlyPlayedGames: Game[] = [];
    let recommendedGames: Game[] = [];
    let totalGamesInLibrary = 0;

    onMount(async () => {
        authStore.initialize();

        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        } else {
            await Promise.all([
                fetchRecentlyPlayedGames(),
                fetchRecommendedGames(),
                fetchTotalGamesInLibrary(),
            ]);
        }
    });

    async function fetchRecentlyPlayedGames() {
        try {
            const response = await fetch(
                `http://localhost:3000/api/games/library/${user.userId}`
            );
            if (response.ok) {
                const data: Game[] = await response.json();
                recentlyPlayedGames = data.slice(0, 3);
            } else {
                console.error('Failed to fetch user library for recently played games.');
            }
        } catch (error) {
            console.error('Error fetching user library:', error);
        }
    }

    async function fetchRecommendedGames() {
        try {
            const response = await fetch('http://localhost:3000/api/games');
            if (response.ok) {
                const data: Game[] = await response.json();
                recommendedGames = data.slice(0, 4);
            } else {
                console.error('Failed to fetch games from the store for recommendations.');
            }
        } catch (error) {
            console.error('Error fetching games from the store:', error);
        }
    }

    async function fetchTotalGamesInLibrary() {
        try {
            const response = await fetch(
                `http://localhost:3000/api/games/library/${user.userId}`
            );
            if (response.ok) {
                const data: Game[] = await response.json();
                totalGamesInLibrary = data.length;
            } else {
                console.error('Failed to fetch total games in library.');
            }
        } catch (error) {
            console.error('Error fetching total games in library:', error);
        }
    }

    function navigateToGame(gameId: number) {
        goto(`${ROUTES.STORE}/${gameId}`);
    }
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <Navbar />

    <div class="max-w-6xl mx-auto mt-24">
        <h1 class="text-4xl font-bold text-white text-center mb-10">
            Welcome back, {user?.username}!
        </h1>

        <!-- Recently Played Games -->
        {#if recentlyPlayedGames.length > 0}
            <section class="mb-12">
                <h2 class="text-3xl font-semibold text-white mb-6">
                    Recently Played
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {#each recentlyPlayedGames as game}
                        <div
                                class="bg-gray-900 rounded-lg shadow-xl p-6 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                                on:click={() => navigateToGame(game.id)}
                                role="button"
                                tabindex="0"
                                on:keydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    navigateToGame(game.id);
                                }
                            }}
                        >
                            <div class="game-image-placeholder bg-gray-700 h-32 w-full rounded-md mb-4 flex items-center justify-center">
                                <img src="https://dummyimage.com/400x400" alt="Game {game.title}" class="object-cover w-full h-full rounded-md" />
                            </div>
                            <h2 class="text-2xl font-bold text-white mb-2">
                                {game.title}
                            </h2>
                            <p class="text-gray-300 text-sm">
                                {game.description}
                            </p>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        <!-- Recommended Games -->
        {#if recommendedGames.length > 0}
            <section class="mb-12">
                <h2 class="text-3xl font-semibold text-white mb-6">
                    Recommended Games
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {#each recommendedGames as game}
                        <div
                                class="bg-gray-900 rounded-lg shadow-xl p-6 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                                on:click={() => navigateToGame(game.id)}
                                role="button"
                                tabindex="0"
                                on:keydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    navigateToGame(game.id);
                                }
                            }}
                        >
                            <div class="game-image-placeholder bg-gray-700 h-32 w-full rounded-md mb-4 flex items-center justify-center">
                                <img src="https://dummyimage.com/400x400" alt="Game {game.title}" class="object-cover w-full h-full rounded-md" />
                            </div>
                            <h2 class="text-2xl font-bold text-white mb-2">
                                {game.title}
                            </h2>
                            <p class="text-gray-300 text-sm">
                                {game.description}
                            </p>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        <!-- Library Summary -->
        <section>
            <h2 class="text-3xl font-semibold text-white mb-6">
                Your Library at a Glance
            </h2>
            <div class="bg-gray-900 rounded-lg shadow-xl p-6">
                <p class="text-lg text-white">
                    You have a total of <span class="font-bold">{totalGamesInLibrary}</span> games
                    in your library.
                </p>
            </div>
        </section>
    </div>
</main>