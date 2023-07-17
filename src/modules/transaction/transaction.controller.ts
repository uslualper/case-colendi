import {
  Controller,
  Post,
  Patch,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import {
  TransactionLimitScope,
  TransactionDeposit,
  TransactionSpend,
  TransactionSpendVerify,
} from './transaction.dto';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('limit-scope')
  async limitScope(@Body() transaction: TransactionLimitScope) {
    return await this.transactionService.checkCardScope(transaction);
  }

  @Post('deposit')
  async deposit(@Request() req, @Body() deposit: TransactionDeposit) {
    const userId = req.user.sub;
    return await this.transactionService.deposit(userId, deposit);
  }

  @Post('spend')
  async spend(@Request() req, @Body() spend: TransactionSpend) {
    const userId = req.user.sub;
    return await this.transactionService.spend(userId, spend);
  }

  @Patch('/spend-verify/:id')
  async spendVerify(
    @Param('id') id: number,
    @Body() spend: TransactionSpendVerify,
  ) {
    return await this.transactionService.spendVerify(id, spend);
  }
}
