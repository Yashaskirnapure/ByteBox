export type FileData = {
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    type: "file" | "folder",
    size: number,
    fileUrl: string,
    parentId: string,
};

export type DirectoryStackItem = {
    id: string | null,
    name: string,
}

export class DirectoryStack{
    private stack: Array<DirectoryStackItem>;
    
    constructor(initial? : Array<DirectoryStackItem>){
        this.stack = initial ?? [];
    }

    push(item: DirectoryStackItem){ this.stack.push(item); }

    pop(): DirectoryStackItem | undefined {
        if(this.stack.length > 1) return this.stack.pop();
        return this.stack[0];
    }

    peek(): DirectoryStackItem | undefined { return this.stack[this.stack.length-1]; }

    length(): number { return this.stack.length; }
}