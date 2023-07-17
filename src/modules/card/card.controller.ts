import {
  Controller,
  Param,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CardService } from '../card/card.service';
import { Body, Query } from '@nestjs/common';
import { CardCreate, CardUpdate, MccCreate } from './card.dto';
import { CardGuard } from './card.guard';

@ApiBearerAuth()
@ApiTags('card')
@UseGuards(AuthGuard)
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Get('')
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  async getMyCards(@Request() req, @Query('page') page = 1) {
    const userId = req.user.sub;
    return this.cardService.getCards(userId, Number(page));
  }

  @Get('/:id')
  async getMyCard(@Request() req, @Param('id') id: number) {
    const userId = req.user.sub;
    return this.cardService.getCard(userId, Number(id));
  }

  @Post('')
  async createCard(@Request() req, @Body() card: CardCreate) {
    const userId = req.user.sub;
    return this.cardService.createCard(userId, card);
  }

  @Patch('/:id')
  @UseGuards(CardGuard)
  async updateCard(
    @Request() req,
    @Param('id') id: number,
    @Body() card: CardUpdate,
  ) {
    return this.cardService.updateCard(Number(id), card);
  }

  @Delete(':id/cancel')
  @UseGuards(CardGuard)
  async cancelCard(@Param('id') cardId: number) {
    return this.cardService.cancelCard(cardId);
  }

  @Post('/:id/mcc')
  @UseGuards(CardGuard)
  async addMccToCard(
    @Request() req,
    @Param('id') id: number,
    @Body() mcc: MccCreate,
  ) {
    return this.cardService.addMccToCard(Number(id), mcc.mccId);
  }
}
