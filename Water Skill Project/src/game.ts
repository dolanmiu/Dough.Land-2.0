module WaterSkillGame {
    export class Game {
        private game: Phaser.Game;
        private width: number;
        private height: number;

        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
        }

        run(container: string, apiDomain: string, loadedCallback: Function) {
            // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
            this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, container, WaterSkillGame.States.MainState);
            this.game.apiDomain = apiDomain;
            this.game.stateLoadedCallback = loadedCallback;
        }

        setJackpotItemsArray(array: Array<Models.JackpotEntry>, maxItems: number) {
            var state = <States.IMainState>this.game.state.getCurrentState();
            if (state) {
                state.setJackpotItemsArray(array, maxItems);
            }
        }

        setWinner(winner: any) {
            var state = <States.IMainState>this.game.state.getCurrentState();
            if (state) {
                state.setWinner(winner);
            }
        }

        setTime(time: number) {
            var state = <States.IMainState>this.game.state.getCurrentState();
            if (state) {
                state.setTime(time);
            }
        }

        setWaterLevel(percentage: number, delay?: number) {
            var state = <States.IMainState>this.game.state.getCurrentState();
            if (state) {
                state.setWaterLevel(percentage, delay);
            }
        }

        destroy() {
            this.game.destroy();
        }
    }
}
