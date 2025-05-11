import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetReading } from './asset.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([AssetReading])], 
  controllers: [AssetController], 
  providers: [AssetService],
})
export class AssetModule {}
