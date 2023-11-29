export interface Task {
    id?:number,
    name:string,
    cathegory:string | null | undefined,
    author:string,
    date:string,
    priority:string  | null | undefined
}
