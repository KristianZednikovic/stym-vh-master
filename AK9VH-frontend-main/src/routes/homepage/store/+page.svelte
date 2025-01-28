<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { authStore } from "../../../stores/authStore";
    import { ROUTES } from "../../../config/constants";
    import Navbar from "$lib/components/Navbar.svelte";

    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;

    onMount(() => {
        // Initialize auth store
        authStore.initialize();

        // Check authentication
        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        }
    });

    function goToGameOne() {
        goto(ROUTES.GAME_ONE);
    }

    function goToGameTwo() {
        //goto(ROUTES.GAME_TWO);
    }
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <!-- Top Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto mt-24">
        <h1 class="text-4xl font-bold text-white text-center mb-10">
            Select a Game
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Game 1 Card -->
            <button
                    class="bg-gray-900 rounded-lg p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    on:click={goToGameOne}
            >
                <div class="text-2xl font-semibold text-blue-400 mb-4">Game 1</div>
                <p class="text-gray-300">
                    Description for Game 1. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                </p>
            </button>

            <!-- Game 2 Card -->
            <button
                    class="bg-gray-900 rounded-lg p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    on:click={goToGameTwo}
            >
                <div class="text-2xl font-semibold text-green-400 mb-4">Game 2</div>
                <p class="text-gray-300">
                    Description for Game 2. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                </p>
            </button>

            <!-- Game 3 Card -->
            <button
                    class="bg-gray-900 rounded-lg p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    on:click={goToGameTwo}
            >
                <div class="text-2xl font-semibold text-purple-400 mb-4">Game 3</div>
                <p class="text-gray-300">
                    Description for Game 3. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                </p>
            </button>

            <!-- Game 4 Card -->
            <button
                    class="bg-gray-900 rounded-lg p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    on:click={goToGameTwo}
            >
                <div class="text-2xl font-semibold text-yellow-400 mb-4">Game 4</div>
                <p class="text-gray-300">
                    Description for Game 4. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                </p>
            </button>
        </div>
    </div>
</main>