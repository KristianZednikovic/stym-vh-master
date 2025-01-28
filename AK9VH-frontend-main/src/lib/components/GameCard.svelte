<script lang="ts">
    import { goto } from '$app/navigation';
    import { ROUTES } from '$config/constants';

    export let game: {
        id: number;
        title: string;
        description: string;
        color: string;
    };

    function navigateToGame() {
        goto(`${ROUTES.STORE}/${game.id}`);
    }
</script>

<div
        class="game-card bg-gray-900 rounded-lg shadow-xl p-6 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
        on:click={navigateToGame}
        role="button"
        tabindex="0"
        on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                navigateToGame();
            }
        }}
>
    <div class="game-card-content">
        <div class="game-image-placeholder bg-gray-700 h-32 w-full rounded-md mb-4">
            <img src="https://dummyimage.com/400x400" alt="Game {game.title}" class="object-cover w-full h-full rounded-md" />
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">{game.title}</h2>
        <p class="text-gray-300 text-sm">{game.description}</p>
    </div>
</div>

<style>
    .game-card {
        border: 1px solid #4b5563;
    }

    .game-card:hover {
        border-color: #6b7280;
    }

    .game-image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>