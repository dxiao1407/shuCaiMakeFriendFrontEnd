import {UserType} from "./user";

/**
 * 队伍类别
 */
export type TeamType = {
    id: number;
    teamName: string;
    description: string;
    maxNum: number;
    expireTime?: Date;
    //todo 定义枚举值、更规范
    teamState: number;
    teamPassword?: string;
    createTime: Date;
    updateTime: Date;
    userVoList?:UserType;
};