<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {authStore} from '../../../stores/authStore';
    import {ROUTES} from '../../../config/constants';
    import Navbar from "$lib/components/Navbar.svelte";
    import type {User} from "$lib/types/user";


    $: user = $authStore.user as User;
    $: isAuthenticated = $authStore.isAuthenticated;

    onMount(() => {
        // Initialize auth store
        authStore.initialize();

        // Check authentication
        if (!isAuthenticated || !$authStore.user) {
            goto(ROUTES.LOGIN);
        }
    });

    let isEditing = false;
    let isHovering = false;
    let newEmail = "";
    let emailUpdateError = "";

    const startEditing = () => {
        isEditing = true;
        newEmail = user.email;
    };

    const cancelEditing = () => {
        isEditing = false;
        newEmail = '';
    };

    const handleSave = async () => {
        emailUpdateError = "";

        try {
            if (!newEmail || !newEmail.includes('@')) {
                emailUpdateError = "Please enter valid email";
                return;
            }

            const previousEmail = user.email;

            // Update information in authstore
            authStore.updateUser({...user, email: newEmail});

            const response = await fetch("/api/users/updateEmail", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: newEmail})
            });

            if (!response.ok) {
                // revert on fail
                authStore.updateUser({...user, email: previousEmail});
                console.error("Failed to update email");
            }

            isEditing = false;
            isHovering = false;

        } catch (error) {
            console.error("Error updating email: ", error);
            emailUpdateError = "Failed to update email."
        }

    }


</script>

<main class="min-h-screen bg-gray-800 p-4">
    <!-- Top Navigation Bar -->
    <Navbar/>

    <!-- Main Content -->
    {#if user}
        <div class="max-w-6xl mx-auto mt-24">

            <!-- User profile card -->
            <div class="bg-gray-900 rounded-lg p-6 shadow-xl mb-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">Profile</h2>
                        <p class="text-gray-400">Member since {user.joinDate}</p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-gray-800 p-4 rounded">
                        <p class="text-gray-400 text-sm mb-2">Username</p>
                        <p class="text-white">{user.username}</p>
                    </div>

                    <!-- Email -->
                    <div
                            class="bg-gray-800 p-4 rounded"
                            on:mouseenter={() => isHovering = true}
                            on:mouseleave={() => isHovering = false}
                            role="region"
                            aria-label="Email information"
                    >
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-gray-400 text-sm">Email</p>

                            {#if isEditing}
                                <div class="flex items-center text-sm">
                                    <button
                                            on:click={handleSave}
                                            class="text-blue-400 hover:text-blue-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!newEmail || !newEmail.includes('@')}
                                    >
                                        Save
                                    </button>
                                    <span class="text-gray-600 mx-2 opacity-50">·</span>
                                    <button
                                            on:click={cancelEditing}
                                            class="text-gray-400 hover:text-gray-300 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            {/if}
                        </div>

                        {#if isEditing}
                            <div class="flex flex-col gap-2">
                                <div class="h-[38px]">
                                    <input
                                            type="email"
                                            bind:value={newEmail}
                                            class="w-full bg-gray-700 text-white px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-[38px]"
                                    />
                                </div>
                                {#if emailUpdateError}
                                    <p class="text-red-400 text-sm">{emailUpdateError}</p>
                                {/if}
                            </div>
                        {:else}
                            <div class="h-[38px] flex items-center justify-between">
                                <p class="text-white">{user.email}</p>
                                {#if isHovering}
                                    <button
                                            on:click={startEditing}
                                            class="text-blue-400 hover:text-blue-300 text-sm focus:outline-none transition-opacity duration-200"
                                    >
                                        Edit
                                    </button>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</main>