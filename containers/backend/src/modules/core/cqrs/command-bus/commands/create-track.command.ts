import { ICommand } from "@nestjs/cqrs";
import { User } from "../../../modules/db/entities/user.model";

export class CreateTrackCommand implements ICommand {
    constructor(public id: string, public addedBy: User) {
    }

}