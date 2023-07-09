export abstract class Card {
    id: number;
    name: string;
    description: string;
    front: string;
    back: string;

    constructor(id: number, name: string, description: string, front: string, back: string){
        this.id = id;
        this.name = name;
        this.description = description;
        this.front = front;
        this.back = back;
    }

    abstract toString(): string;

    getId(): number {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getFront(): string {
        return this.front;
    }

    getBack(): string {
        return this.back;
    }
}