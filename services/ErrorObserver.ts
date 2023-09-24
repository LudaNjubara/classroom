
export type TToastContent = {
    title: string;
    description: string;
}

export type TObserver = (toastContent: TToastContent) => void;

class Observable {
    private _subscribers: TObserver[] = [];

    subscribe(observer: TObserver) {
        this._subscribers.push(observer);
    }

    unsubscribe(observer: TObserver) {
        this._subscribers = this._subscribers.filter(subscriber => subscriber !== observer);
    }

    notify(toastContent: TToastContent) {
        this._subscribers.forEach(sub => sub(toastContent));
    }
}

const observableError = new Observable();

export default observableError;