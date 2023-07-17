import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CardService } from '../card/card.service';

@Injectable()
export class CardGuard implements CanActivate {
  constructor(private cardService: CardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request['user'].sub;

    if (await !this.cardService.getCard(userId, Number(request.params.id))) {
      throw new Error('Card not found');
    }
    return true;
  }
}
