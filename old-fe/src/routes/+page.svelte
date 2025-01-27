<script lang="ts">
    import "../app.css";
    import {goto} from "$app/navigation";

    function navigateToRegister() {
        goto("/register");
    }

    function navigateToLogin() {
        goto("/login");
    }
</script>

<main class="flex items-center justify-center min-h-screen bg-gray-800">
    <div class="flex flex-col w-96 p-8 rounded-lg bg-gray-800/50 shadow-xl">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-white text-center mb-8">Welcome</h1>

        <!-- Description -->
        <p class="text-gray-300 text-center mb-8">
            Please login to your account or create a new one to get started
        </p>

        <!-- Buttons Container -->
        <div class="flex flex-col gap-4">
            <button
                    on:click={navigateToLogin}
                    class="bg-blue-700 px-8 py-3 rounded font-bold hover:bg-blue-600 transition-all duration-200 text-white">
                Login to Your Account
            </button>

            <button
                    on:click={navigateToRegister}
                    class="bg-transparent border-2 border-blue-700 px-8 py-3 rounded font-bold hover:bg-blue-700/20 transition-all duration-200 text-white">
                Create New Account
            </button>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
            <p class="text-gray-400 text-sm">
                © 2024 Stym - the best game store!
            </p>
        </div>
    </div>
</main>

<style lang="css">
</style>