export interface WorkSegment{
    id: number;
    label: string;
    createdAt: Date;
    endedAt: Date;
    duration: number;
    tagRefs: number[];
    mode: string;
}