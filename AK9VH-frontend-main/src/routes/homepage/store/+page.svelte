<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { authStore } from '../../../stores/authStore';
    import { ROUTES } from '$config/constants';
    import Navbar from '$lib/components/Navbar.svelte';
    import GameCard from '$lib/components/GameCard.svelte';

    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;

    let games: any[] = [];

    onMount(async () => {
        authStore.initialize();
        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        } else {
            try {
                const response = await fetch('http://localhost:3000/api/games', {
                    headers: {
                        Authorization: `Bearer ${$authStore.token}`,
                    },
                });
                if (response.ok) {
                    games = await response.json();
                    console.log("games:", games);
                } else {
                    console.error('Failed to fetch games:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        }
    });
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <Navbar />

    <div class="max-w-6xl mx-auto mt-24">
        <h1 class="text-4xl font-bold text-white text-center mb-10">
            Select a Game
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {#each games as game}
                <GameCard game={{ id: game.id, title: game.title, description: game.description, color: 'blue' }} />
            {/each}
        </div>
    </div>
</main>