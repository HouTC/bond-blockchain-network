import { Pipe, PipeTransform } from "@angular/core";
import { pipe } from "rxjs";

@Pipe({
    name: 'HoldingFilterAsset'
})

export class HoldingFilterAssetPipe implements PipeTransform
{
    transform(allAssets : any, AssetFind2: any):any {

        if(AssetFind2  === undefined)
        {
            return allAssets;
        }
        else{
            return allAssets.filter(
                function(x)
                {
                    return x.holdingId.includes(AssetFind2);
                }
            )
        }

    }
}