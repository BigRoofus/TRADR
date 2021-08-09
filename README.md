# TRADR

TRADR is an app designed to make you better at day-trading US stocks.

It features advanced order types, allowing for more advanced strategies, such as those seen in DMA software like DAS Trader.

### Buy
Profit off potential upward movement in the instrument by buying at the current price.  These can be stacked to trade in bigger proportions.

### Sell (Short-Sell)
Profit off potential downward movement in the instrument by [short selling](https://en.wikipedia.org/wiki/Short_(finance)).  These can be stacked to trade in bigger proportions.

Note that selling a position that have you a previous buy position in will not close out the original buy (or vice versa), and that it is possible to have a buy and a sell (or any combination of positions) open in the same instrument at the same time.  For example, buying 100 shares, then selling 100 shares.  This will lock-in the current profit or loss, and will not produce any more gains or losses as the price moves.  For example, if you bought 100 shares at $10, then the price went up to $12.50, and you sold 100 shares, this would lock-in a profit of $250, whether the price moves up to $250, or down to $1, or literally anywhere else.

Now, you may be wondering, why not just close out the buy at $12.50, realize the gains, and free up the capital for the next trade?  Possible reasons include not realizing gains until a given time for tax purposes, and avoiding the pattern day trading rule.

### Flat (All, 50%, or 25%)
Flatting closes out positions, in whole or in part.  Reasons for not closing out trades 100% at at time include [scaling out](https://www.investopedia.com/terms/s/scale-out.asp).

### Reverse
Completely closes out your position(s) and opens an identically sized position in the opposite direction.

### Replay
Replay quickly replays the last few bars of price action, as sometimes watching a chart move gives you more of a feeling for what's happening than seeing it frozen in time.
