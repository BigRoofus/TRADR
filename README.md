# TRADR

TRADR is an app designed to make you better at day-trading US stocks.

It features advanced order types, allowing for more advanced strategies, such as those seen in DMA software like DAS Trader.

## Buy
Profit off upward movement in the instrument by buying at the current price.  These can be stacked to trade in bigger proportions.

### Sell (Short-Sell)
Profit off downward movement in the instrument by short selling.  These can be stacked to trade in bigger proportions.  Note that selling a position that have a previous buy in while not close out the original buy, and that it is possible to have a buy and a sell open in the same instrument (for example, buy 100 shares, then sell 100 shares).  This will not produce any gains or loses as the price moves.  For example, if you bought 100 shares at $1, then the price went up to $1.25, and you sold 100 shares, this would lock in a profit.  Now, you may be asking, why not just close out the buy at $1.25?  Possible reasons include not realzing gains and losses for tax purposes, and avoiding the pattern day trading rule

### Flat All, 50%, or 25%
This closes out postions, in whole or in part.

### Reverse
Completely closes out your position and opens an identically sized positon in the opposite direction.

### Replay
Replay quickly replays the last few bars of price action, as sometimes watching a chart move gives you more of a feeling for what's happening than seeing it frozen in time.
