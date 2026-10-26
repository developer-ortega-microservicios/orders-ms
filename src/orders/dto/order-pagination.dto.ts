import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto.js";
import { OrderStatusList } from "../enum/order.enum.js";
import { OrderStatus } from "../../generated/prisma/enums.js";

export class OrderPaginationDto extends PaginationDto {

    @IsOptional()
    @IsEnum( OrderStatusList, {
        message: `Valid Status are ${ OrderStatusList }`
    })
    status: OrderStatus


}