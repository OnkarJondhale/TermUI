import { App, type KeyEvent } from '@termuijs/core';
import { Widget, Box, Text, Button } from '@termuijs/widgets';

class ButtonDemoApp extends Widget {
    private _status: Text;
    private _buttons: Button[] = [];
    private _labels: string[] = [];
    private _activeIndex = 0;

    constructor() {
        super({ flexDirection: 'column', padding: 1, gap: 1, width: 64, height: 11 });

        const title = new Text(' Shared Button Demo ', {
            bold: true,
            height: 1,
            fg: { type: 'named', name: 'cyan' },
        }, { align: 'center' });

        const hint = new Text('Left/Right change the active button. Enter/Space presses it. Q quits.', {
            height: 1,
            fg: { type: 'named', name: 'brightBlack' },
        }, { align: 'center' });

        const row = new Box({ flexDirection: 'row', gap: 2, height: 3, flexGrow: 1 });

        const launch = new Button('Launch', { height: 3, flexGrow: 1 }, {
            variant: 'primary',
            onPress: () => this._handleButtonPress('Launch'),
        });
        const deleteButton = new Button('Delete', { height: 3, flexGrow: 1 }, {
            variant: 'danger',
            onPress: () => this._handleButtonPress('Delete'),
        });
        const disabled = new Button('Disabled', { height: 3, flexGrow: 1 }, {
            variant: 'ghost',
            disabled: true,
            onPress: () => this._handleButtonPress('Disabled'),
        });

        this._buttons = [launch, deleteButton, disabled];
        this._labels = ['Launch', 'Delete', 'Disabled'];
        for (const button of this._buttons) {
            row.addChild(button);
        }

        this._status = new Text('Active: Launch | Last pressed: none', {
            height: 1,
            fg: { type: 'named', name: 'yellow' },
        }, { align: 'center' });

        this.addChild(title);
        this.addChild(hint);
        this.addChild(row);
        this.addChild(this._status);
    }

    handleKey(event: KeyEvent): boolean {
        if (event.key === 'q' || (event.ctrl && event.key === 'c')) {
            return false;
        }

        if (event.key === 'left') {
            this._activeIndex = (this._activeIndex - 1 + this._buttons.length) % this._buttons.length;
            this._setStatus(`Active: ${this._labels[this._activeIndex]} | Last pressed: none`);
            return true;
        }

        if (event.key === 'right') {
            this._activeIndex = (this._activeIndex + 1) % this._buttons.length;
            this._setStatus(`Active: ${this._labels[this._activeIndex]} | Last pressed: none`);
            return true;
        }

        if (event.key === 'enter' || event.key === 'space') {
            this._buttons[this._activeIndex].handleKey({ key: event.key } as KeyEvent);
            return true;
        }

        return true;
    }

    private _setStatus(status: string): void {
        this._status.setContent(status);
        this.markDirty();
    }

    private _handleButtonPress(label: string): void {
        this._setStatus(`Pressed: ${label}`);
    }

    protected _renderSelf(): void {
        // Children render the demo.
    }
}

async function main() {
    const root = new ButtonDemoApp();
    const app = new App(root, {
        fullscreen: true,
        title: 'Shared Button Demo',
        fps: 30,
    });

    app.events.on('key', (event) => {
        const shouldContinue = root.handleKey(event);
        if (!shouldContinue) {
            app.exit(0);
        }
        app.requestRender();
    });

    const exitCode = await app.mount();
    process.exit(exitCode);
}

main().catch((err) => {
    console.error('Button demo error:', err);
    process.exit(1);
});
