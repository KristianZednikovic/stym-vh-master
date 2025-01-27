<script lang="ts">

    import {page} from "$app/stores";
    import {ROUTES} from "../../config/constants";
    import {Gamepad2, Home, PackageOpen, Settings, User} from "lucide-svelte";
    import {authStore} from "../../stores/authStore";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

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

<main>
    <!-- Top Navigation Bar -->
    <nav class="bg-gray-900 fixed top-0 left-0 right-0 p-4 shadow-lg">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white">Dashboard</h1>

            <!-- Navigation Items -->
            <div class="flex items-center gap-10">
                <a class="flex flex-col items-center transition-colors duration-200 {$page.url.pathname === ROUTES.HOMEPAGE ? 'text-blue-400' : 'text-white hover:text-blue-300 visited:text-white'}"
                   href={ROUTES.HOMEPAGE}>
                    <Home size="24"/>
                    <span class="text-xs mt-1">Home</span>
                </a>
                <a class="flex flex-col items-center transition-colors duration-200 {$page.url.pathname === ROUTES.PROFILE ? 'text-blue-400' : 'text-white hover:text-blue-300 visited:text-white'}"
                   href={ROUTES.PROFILE}>
                    <User size="24"/>
                    <span class="text-xs mt-1">Profile</span>
                </a>
                <a class="flex flex-col items-center transition-colors duration-200 {$page.url.pathname === ROUTES.STORE ? 'text-blue-400' : 'text-white hover:text-blue-300 visited:text-white'}"
                   href={ROUTES.STORE}>
                    <PackageOpen size="24"/>
                    <span class="text-xs mt-1">Store</span>
                </a>
                <a class="flex flex-col items-center transition-colors duration-200 {$page.url.pathname === ROUTES.LIBRARY ? 'text-blue-400' : 'text-white hover:text-blue-300 visited:text-white'}"
                   href={ROUTES.LIBRARY}>
                    <Gamepad2 size="24"/>
                    <span class="text-xs mt-1">Library</span>
                </a>
                <a class="flex flex-col items-center transition-colors duration-200 {$page.url.pathname === ROUTES.SETTINGS ? 'text-blue-400' : 'text-white hover:text-blue-300 visited:text-white'}"
                   href={ROUTES.SETTINGS}>
                    <Settings size="24"/>
                    <span class="text-xs mt-1">Settings</span>
                </a>
            </div>


            {#if user}
                <div class="flex items-center gap-4">
                    <span class="text-gray-300">Welcome, {user?.username}!</span>
                    <button
                            on:click={handleLogout}
                            class="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-700 transition-all duration-200 text-white">
                        Logout
                    </button>
                </div>
            {/if}
        </div>
    </nav>
    <!-- Main Content -->
</main>

<style>
    /*a:visited {*/
    /*    color: white;*/
    /*}*/
</style>