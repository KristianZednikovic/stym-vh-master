<script lang="ts">
    import "../../app.css";
    import {goto} from "$app/navigation";
    import {fetchApi} from '$lib/utils/api';
    import {API_ENDPOINTS, DELAYS, ROUTES} from '../../config/constants';
    import {ChevronLeft} from "lucide-svelte";

    let username = "";
    let email = "";
    let password = "";

    let usernameError = "";
    let emailError = "";
    let passwordError = "";
    let registerServerError = "";
    let isRegisterSuccess = false;
    let registerSuccessMessage = "Registration successful! You can now login.";

    async function handleRegister() {
        // Reset errors and success state
        usernameError = emailError = passwordError = "";
        registerServerError = "";
        isRegisterSuccess = false;

        // Validate inputs
        if (!username) {
            usernameError = "Username is required";
        }
        if (!email) {
            emailError = "Email is required";
        }
        if (!password) {
            passwordError = "Password is required";
        }
        if (usernameError || emailError || passwordError) return;

        // Attempt registration
        try {
            const response = await fetchApi(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify({username, email, password})
            });

            if (response.ok) {
                isRegisterSuccess = true;
                // Clear form
                username = "";
                email = "";
                password = "";

                // Redirect after a short delay to show success message
                setTimeout(() => {
                    goto(ROUTES.LOGIN);
                }, DELAYS.REGISTER_REDIRECT_DELAY);
            } else {
                const errorData = await response.json();
                registerServerError = errorData.message;
            }
        } catch (error) {
            console.error("Registration error:", error);
            registerServerError = "An error occurred during registration";
        }
    }

    function navigateToHome() {
        goto(ROUTES.HOME);
    }
</script>

<main class="flex items-center justify-center min-h-screen relative bg-gray-800">
    <!-- Back button -->
    <button
            class="absolute top-4 left-4 bg-blue-700 px-4 py-2 rounded font-bold flex items-center hover:scale-110 text-white"
            on:click={navigateToHome}>
        <ChevronLeft class="mr-1" size={20} strokeWidth={3}/>
        Back
    </button>

    <!-- Register fields -->
    <div class="flex flex-col w-96">
        <!-- Username field -->
        <label
                class="text-lg font-medium text-white mb-1"
                for="username">
            Username
        </label>
        <input
                bind:value={username}
                class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {usernameError ? 'border-red-500 border-2' : ''}"
                id="username"
                placeholder="Enter your username"
                type="text"
        >
        {#if usernameError}
            <p class="text-red-500 text-sm mb-2">{usernameError}</p>
        {/if}

        <!-- Email field -->
        <label
                class="text-lg font-medium text-white mb-1"
                for="email">
            Email Address
        </label>
        <input
                bind:value={email}
                class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {emailError ? 'border-red-500 border-2' : ''}"
                id="email"
                placeholder="Enter your email"
                type="email"
        >
        {#if emailError}
            <p class="text-red-500 text-sm mb-2">{emailError}</p>
        {/if}

        <!-- Password field -->
        <label
                class="text-lg font-medium text-white mb-1"
                for="password">
            Password
        </label>
        <input
                bind:value={password}
                class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {passwordError ? 'border-red-500 border-2' : ''}"
                id="password"
                placeholder="Enter your password"
                type="password"
        >
        {#if passwordError}
            <p class="text-red-500 text-sm mb-2">{passwordError}</p>
        {/if}

        <!-- Register button -->
        <button
                class="bg-blue-700 my-2 py-2 rounded font-bold hover:bg-blue-600 transition-colors duration-200 text-white"
                on:click={handleRegister}>
            Register
        </button>

        <!-- Status messages -->
        <div class="min-h-[40px]">
            {#if registerServerError}
                <p class="text-red-500 text-sm break-words">{registerServerError}</p>
            {/if}
            {#if isRegisterSuccess}
                <p class="text-green-500 text-sm break-words">{registerSuccessMessage}</p>
            {/if}
        </div>

        <!-- Login link -->
        <div class="text-center mt-2">
            <p class="text-white text-sm">
                Already have an account?
                <a
                        class="text-blue-400 hover:underline"
                        href={ROUTES.LOGIN}>
                    Login here
                </a>
            </p>
        </div>
    </div>
</main>