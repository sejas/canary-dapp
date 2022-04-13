import {
  Card, CardContent, Typography, CardActions, Button,
} from '@mui/material';

export function Tweet(props) {
  const {
    tweet, currentAccount, onLike, onDelete, ...rest
  } = props;

  return (
    <Card {...rest}>
      <CardContent title={tweet.id}>
        <Typography variant="body2" color="textSecondary" component="p">
          {tweet.owner}
          <Typography variant="body2" color="textSecondary" component="span">
            {tweet.timestamp > 0 && ` - ${new Date(tweet.timestamp * 1000).toLocaleDateString()}`}
          </Typography>
        </Typography>
        <Typography sx={{ wordBreak: 'break-all' }} variant="h5" component="p">
          {tweet.tweetText}
        </Typography>
      </CardContent>
      <CardActions>
        {onLike && <Button onClick={onLike} size="small" color="primary">
          {tweet.likes}
          <span className="material-icons">{tweet.likes === 0 ? 'favorite_border' : 'favorite'}</span>
        </Button>}
        {tweet.owner.toLowerCase() === currentAccount.toLowerCase() && (
          <Button sx={{ ml: 'auto' }} onClick={onDelete} size="small" color="primary">
            <span className="material-icons">delete</span>
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
