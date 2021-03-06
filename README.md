# TRADR

TRADR is an app designed to make you better at day-trading US stocks.

It features advanced order types, allowing for more advanced strategies, akin to those used in Direct Market Access software such as DAS Trader.

### Buy
Profit off potential upward movement in the instrument by buying at the current price.  Muiltiple buys can be issued at once to trade in bigger proportions.

### Sell (Short-Sell)
Profit off potential downward movement in the instrument by [short selling](https://en.wikipedia.org/wiki/Short_(finance)).  Muiltiple sells can be issued at once to trade in bigger proportions.

Note that selling a position in which you have you a previous buy position will not close out the original buy (or vice versa), and that it is possible to have a buy and a sell (or any combination of positions) open in the same instrument at the same time.  For example, buying 100 shares, then selling 100 shares.  This will lock in the current profit or loss, and will not produce any more gains or losses as the price moves.  For example, if you bought 100 shares at $10, then the price went up to $12.50, and you sold 100 shares, this would lock in a profit of $250, whether the price moves up to $3000, or down to $1, or literally anywhere else, you would still keep a $250 return on investment.

Why not just close out the buy at $12.50, realize the gains, and free up the capital for the next trade?  Possible reasons include not realizing gains until a given time for tax purposes, and avoiding the [pattern day trading rule](https://en.wikipedia.org/wiki/Pattern_day_trader).

Another reason for allowing multiple concurrent positions are the complex [grid systems](https://admiralmarkets.com/education/articles/forex-strategy/forex-grid-trading-strategy-explained) some traders use that involve having dozens of positions open at the same time.  Though you could argue that grid systems aren't really day-trading, we saw no reason not to allow them.  Though remember, all open trades will be auto closed at end of day.

### Flat (All, 50%, or 25%)
Flatting is the only way to close out positions, in whole or in part.  Remember that buying or selling always adds to your current position and increases the amount of capital you have invested. Reasons for closing out trades piecemeal include [scaling out](https://www.investopedia.com/terms/s/scale-out.asp).

### Reverse
Completely closes out your position(s) and opens an identically sized position in the opposite direction.

### Replay
Quickly replays the last few bars of price action, as sometimes watching a chart move gives you more of a feeling for what's happening than seeing it frozen in time.  This is due in part to predatory motion perception.
