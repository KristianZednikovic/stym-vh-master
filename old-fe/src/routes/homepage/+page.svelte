<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {authStore} from '../../stores/authStore';
    import {ROUTES} from '../../config/constants';
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

    async function handleLogout() {
        try {
            const response = await fetch("http://localhost:3000/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${$authStore.token}`
                }
            });

            if (response.ok) {
                authStore.logout();
                await goto(ROUTES.LOGIN);
            }
        } catch (error) {
            console.error("Logout error:", error);
            authStore.logout();
            await goto(ROUTES.LOGIN);
        }
    }


</script>

<main class="min-h-screen bg-gray-800 p-4">
    <!-- Top Navigation Bar -->

    <Navbar/>


    <!-- Main Content -->
</main>