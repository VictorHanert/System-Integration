// publicere og abonnere på realtidsbegivenheder (som bookAdded)
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default pubsub;