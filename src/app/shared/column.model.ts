import { v4 as uuidv4 } from 'uuid';
import { Task } from "./task.model";

export class Column {
    id:string 

    constructor(public name:string, public tasks:Task[] = [], public taskLimit?: number) {
        this.id = uuidv4();
    }
}