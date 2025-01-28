<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import {authStore} from '../../../stores/authStore';
    import {ROUTES} from '../../../config/constants';
    import Navbar from '$lib/components/Navbar.svelte';
    import type {User} from '$lib/types/user';

    $: user = $authStore.user as User;
    $: isAuthenticated = $authStore.isAuthenticated;

    let currentTheme = 'dark';
    let notificationsEnabled = true;
    let settingsSavedMessage = '';
    let fontSize = 'medium';

    onMount(() => {
        authStore.initialize();

        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        }

        loadUserSettings();
    });

    function loadUserSettings() {
        currentTheme = localStorage.getItem('theme') || 'dark';
        notificationsEnabled =
            localStorage.getItem('notifications') === 'true' || true;
    }

    function saveUserSettings() {
        localStorage.setItem('theme', currentTheme);
        localStorage.setItem('notifications', notificationsEnabled.toString());

        settingsSavedMessage = 'Settings saved successfully!';
        setTimeout(() => {
            settingsSavedMessage = '';
        }, 3000);
    }

    function handleFontSizeChange(event: Event) {
        fontSize = (event.target as HTMLSelectElement).value;
    }


    function applyFontSize() {
        const root = document.documentElement; // Get the root element (<html>)

        if (fontSize === 'small') {
            root.style.fontSize = '14px';
        } else if (fontSize === 'medium') {
            root.style.fontSize = '16px';
        } else if (fontSize === 'large') {
            root.style.fontSize = '18px';
        }
    }

    function handleThemeChange(event: Event) {
        currentTheme = (event.target as HTMLSelectElement).value;
    }

    function handleNotificationsChange() {
        notificationsEnabled = !notificationsEnabled;
    }

    $: applyFontSize();
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <Navbar/>

    <div class="max-w-6xl mx-auto mt-24">
        <h1 class="text-4xl font-bold text-white text-center mb-10">
            Settings
        </h1>

        <div class="bg-gray-900 rounded-lg shadow-xl p-8">
            <!-- Theme Setting -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-white mb-4">
                    Theme
                </h2>
                <div class="flex items-center">
                    <label for="theme-select" class="text-gray-300 mr-4">
                        Choose a theme:
                    </label>
                    <select
                            id="theme-select"
                            class="bg-gray-700 text-white py-2 px-4 rounded"
                            value={currentTheme}
                            on:change={handleThemeChange}
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
            </section>

            <!-- Font Size Setting -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-white mb-4">
                    Font Size
                </h2>
                <div class="flex items-center">
                    <label for="font-size-select" class="text-gray-300 mr-4">
                        Choose a font size:
                    </label>
                    <select
                            id="font-size-select"
                            class="bg-gray-700 text-white py-2 px-4 rounded"
                            value={fontSize}
                            on:change={handleFontSizeChange}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            </section>

            <!-- Notifications Setting -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-white mb-4">
                    Notifications
                </h2>
                <div class="flex items-center">
                    <input
                            type="checkbox"
                            id="notifications-checkbox"
                            class="form-checkbox h-5 w-5 text-blue-600"
                            checked={notificationsEnabled}
                            on:change={handleNotificationsChange}
                    />
                    <label
                            for="notifications-checkbox"
                            class="ml-2 text-gray-300"
                    >
                        Enable Notifications
                    </label>
                </div>
            </section>

            <!-- Save Button-->
            <div class="flex justify-end">
                {#if settingsSavedMessage}
                    <p class="text-green-500 mr-4 mt-2">{settingsSavedMessage}</p>
                {/if}
                <button
                        on:click={saveUserSettings}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Save Settings
                </button>

            </div>
        </div>
    </div>
</main>