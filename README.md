# TRADR

TRADR is an app designed to make you better at day-trading US stocks.

It features advanced order types, allowing for more advanced strategies, such as those seen in DMA software like DAS Trader.

### Buy
Profit off potential upward movement in the instrument by buying at the current price.  These can be stacked to trade in bigger proportions.

### Sell (Short-Sell)
Profit off potential downward movement in the instrument by [short selling](https://en.wikipedia.org/wiki/Short_(finance)).  These can be stacked to trade in bigger proportions.

Note that selling a position that have you a previous buy position in will not close out the original buy (or vice versa), and that it is possible to have a buy and a sell (or any combination of positions) open in the same instrument at the same time.  For example, buying 100 shares, then selling 100 shares.  This will lock in the current profit or loss, and will not produce any more gains or losses as the price moves.  For example, if you bought 100 shares at $10, then the price went up to $12.50, and you sold 100 shares, this would lock in a profit of $250, whether the price moves up to $300, or down to $1, or literally anywhere else.

Why not just close out the buy at $12.50, realize the gains, and free up the capital for the next trade?  Possible reasons include not realizing gains until a given time for tax purposes, and avoiding the [pattern day trading rule](https://en.wikipedia.org/wiki/Pattern_day_trader).

Another reason for allowing multiple concurrent positions are the complex [grid systems](https://admiralmarkets.com/education/articles/forex-strategy/forex-grid-trading-strategy-explained) some traders use that involve having dozens of positions open at the same time.  Though you could argue that grid systems aren't really day-trading, we saw no reason not to allow them.  Though remember, all trades will be auto closed at end of day.

### Flat (All, 50%, or 25%)
Flatting is the only way to close out positions, in whole or in part.  Remember that buying or selling always adds to your current position and increases the amount of capital you have invested. Reasons for closing out trades a piece at at time include [scaling out](https://www.investopedia.com/terms/s/scale-out.asp).

### Reverse
Completely closes out your position(s) and opens an identically sized position in the opposite direction.

### Replay
Replay quickly replays the last few bars of price action, as sometimes watching a chart move gives you more of a feeling for what's happening than seeing it frozen in time.
