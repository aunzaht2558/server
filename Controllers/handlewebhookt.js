const Binance = require('node-binance-api');

const pricePrecision = {
    BTCUSDT: 1,
    BNBUSDT: 2,
    ETHUSDT: 2,
    XRPUSDT: 4,
    LINKUSDT: 3,
    GMTUSDT: 4,
    DARUSDT: 3,
    REEFUSDT: 6,
    DUSKUSDT: 5,
    APEUSDT: 3,
    MKRUSDT: 1,
  };
  
  const contractPrecision = {
    BTCUSDT: 3,
    BNBUSDT: 2,
    ETHUSDT: 3,
    XRPUSDT: 1,
    LINKUSDT: 2,
    DARUSDT: 1,
    REEFUSDT: 0,
    DUSKUSDT: 0,
    APEUSDT: 0,
    GMTUSDT: 0,
    MKRUSDT: 3,
  };
  
  exports.getaccount = async (req, res) => {
    const alert = req.body;
    console.log("alert", alert);
    try {
       let quantity = Number(
            Number(alert.order_contracts).toFixed(
            contractPrecision[alert?.symbol]
            )
        );

        const side = alert.order_action.toUpperCase();
        var leverage = alert.leverage;
		
        const take_profit_price = Number(
            Number(alert.tp_price || 0).toFixed(
              pricePrecision[alert?.symbol]
            )
          );
      
          //Get the stop loss price from Tradingview order
          const stop_loss_price = Number(
            Number(alert.sl_price || 0).toFixed(
              pricePrecision[alert?.symbol]
            )
          );
		  
        const binance = new Binance().options({
            APIKEY:alert.apiKey,
            APISECRET: alert.apiSecret,
            recvWindow: 60000,
        
        });

        console.info( await binance.futuresLeverage( alert.symbol, alert.leverage ) );


      let position_data = await binance.futuresPositionRisk(), markets = Object.keys( position_data );

        for ( let market of markets ) {
        let obj = position_data[market], size = Number( obj.positionAmt );
        if ( obj.symbol != alert.symbol) continue;

        if(size == 0){

            if ( alert.order_action == 'sell' ){
                console.info(  await binance.futuresMarketSell( alert.symbol, quantity ));

 
               let position_data = await binance.futuresUserTrades( alert.symbol ), markets = Object.keys( position_data );
				
				var avgPrice = 0;	
				for ( let market of markets ) {
					let obj = position_data[market];
					avgPrice = Number( obj.price );
					
				}
				
				var get_tp0 = Number((avgPrice * (take_profit_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_tp = Number(parseFloat(avgPrice)-parseFloat(get_tp0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresSell( alert.symbol, quantity, get_tp,{type: 'TAKE_PROFIT'}));
				
				var get_sl0 = Number((avgPrice * (stop_loss_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_sl = Number(parseFloat(avgPrice)+parseFloat(get_sl0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresSell( alert.symbol, quantity, get_sl,{type: 'STOP'}));               
				
				
            } 
            
            if ( alert.order_action == 'buy') {
                console.info(  await binance.futuresMarketBuy( alert.symbol, quantity ));

               let position_data = await binance.futuresUserTrades( alert.symbol ), markets = Object.keys( position_data );
				
				var avgPrice = 0;	
				for ( let market of markets ) {
					let obj = position_data[market];
					avgPrice = Number( obj.price );
					
				}
				
				var get_tp0 = Number((avgPrice * (take_profit_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_tp = Number(parseFloat(avgPrice)+parseFloat(get_tp0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresBuy( alert.symbol, quantity, get_tp,{type: 'TAKE_PROFIT'}));
				
				var get_sl0 = Number((avgPrice * (stop_loss_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_sl = Number(parseFloat(avgPrice)-parseFloat(get_sl0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresBuy( alert.symbol, quantity, get_sl,{type: 'STOP'}));
            }

        }
        else{
            if ( alert.order_action == 'sell'  && size > 0){console.info( await binance.futuresMarketSell( alert.symbol, quantity ))} 
            if ( alert.order_action == 'buy' && size < 0) {console.info( await binance.futuresMarketBuy( alert.symbol, quantity ))}
      
            console.info( size );
        }
        
        //console.info( obj ); //positionAmt entryPrice markPrice unRealizedProfit liquidationPrice leverage marginType isolatedMargin isAutoAddMargin maxNotionalValue
        }
        
        
        position_data = await binance.futuresPositionRisk(), markets = Object.keys( position_data );

        for ( let market of markets ) {
        let obj = position_data[market], size = Number( obj.positionAmt );
        if ( obj.symbol != alert.symbol) continue;

        if(size == 0){

            if ( alert.order_action == 'sell' ){
                console.info(  await binance.futuresMarketSell( alert.symbol, quantity ));

 
               let position_data = await binance.futuresUserTrades( alert.symbol ), markets = Object.keys( position_data );
				
				var avgPrice = 0;	
				for ( let market of markets ) {
					let obj = position_data[market];
					avgPrice = Number( obj.price );
					
				}
				
				var get_tp0 = Number((avgPrice * (take_profit_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_tp = Number(parseFloat(avgPrice)-parseFloat(get_tp0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresSell( alert.symbol, quantity, get_tp,{type: 'TAKE_PROFIT'}));
				
				var get_sl0 = Number((avgPrice * (stop_loss_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_sl = Number(parseFloat(avgPrice)+parseFloat(get_sl0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresSell( alert.symbol, quantity, get_sl,{type: 'STOP'}));               
				
				
            } 
            
            if ( alert.order_action == 'buy') {
                console.info(  await binance.futuresMarketBuy( alert.symbol, quantity ));

               let position_data = await binance.futuresUserTrades( alert.symbol ), markets = Object.keys( position_data );
				
				var avgPrice = 0;	
				for ( let market of markets ) {
					let obj = position_data[market];
					avgPrice = Number( obj.price );
					
				}
				
				var get_tp0 = Number((avgPrice * (take_profit_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_tp = Number(parseFloat(avgPrice)+parseFloat(get_tp0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresBuy( alert.symbol, quantity, get_tp,{type: 'TAKE_PROFIT'}));
				
				var get_sl0 = Number((avgPrice * (stop_loss_price / leverage)) / 100).toFixed(pricePrecision[alert.symbol ]);
				var get_sl = Number(parseFloat(avgPrice)-parseFloat(get_sl0)).toFixed(pricePrecision[alert.symbol ]);
				
				console.info(  await binance.futuresBuy( alert.symbol, quantity, get_sl,{type: 'STOP'}));
            }

        }
        else{
         
            console.info( obj );
        }
        
        //console.info( obj ); //positionAmt entryPrice markPrice unRealizedProfit liquidationPrice leverage marginType isolatedMargin isAutoAddMargin maxNotionalValue
        }

        return res.status(200).send("User not found!!!");
    } catch (error) {
        console.log("---Order error---");
        console.log(error);
        return res.json({ message: error });
    }
  }