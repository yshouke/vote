/**
 * 选举记录的状态：
 * NotStarted 未开始，
 * InProgress 进行中，
 * Ended = 2 已结束，
*/ 
export enum ELECTION_STATUS{
    NotStarted = 0, // 未开始
    InProgress = 1, // 进行中
    Ended = 2 // 已结束
}
/**
 * 用户的身份状态 ：
 * Admin = 0 管理员,
 *  Normal = 1 普通用户
 */
export enum USER_TYPE{
    Admin = 0, // 管理员
    Normal = 1 // 普通用户
}