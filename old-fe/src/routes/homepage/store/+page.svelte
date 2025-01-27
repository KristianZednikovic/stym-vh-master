<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {authStore} from '../../../stores/authStore';
    import {ROUTES} from '../../../config/constants';
    import Navbar from "$lib/components/Navbar.svelte";

    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;
    

    onMount(() => {
        // Initialize auth store
        authStore.initialize();

        // Check authentication
        if (!isAuthenticated) {
            goto(ROUTES.LOGIN); // Přesměruj na login, pokud není uživatel přihlášen
        }
    });

    function goToGameOne() {
        goto(ROUTES.GAME_ONE);
    }

    function goToGameTwo() {
        goto(ROUTES.GAME_TWO);
    }
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <!-- Top Navigation Bar -->
    <Navbar/>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto mt-24">
        <div class="flex gap-4">
            <button class="bg-blue-500 text-white p-2 rounded" on:click={goToGameOne}>
                Hra 1
            </button>
            <button class="bg-green-500 text-white p-2 rounded" on:click={goToGameTwo}>
                Hra 2
            </button>
        </div>
    </div>
</main>
