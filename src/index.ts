import { APIInteraction, InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { commands } from './commands';
import { APIResponse, isCommand, ShowMessage } from './helpers';

export interface Env {
  PUBLIC_KEY: string;
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'POST') {
      const signature = request.headers.get('X-Signature-Ed25519');
      const timestamp = request.headers.get('X-Signature-Timestamp');
      const body = await request.clone().arrayBuffer();

      const isValid = verifyKey(body, signature, timestamp, env.PUBLIC_KEY);

      if (!isValid) {
        return new Response('Could not verify this request.', { status: 401 });
      }

      const i: APIInteraction = await request.json();

      if (i.type === InteractionType.Ping) {
        return APIResponse({
          type: InteractionResponseType.Pong,
        });
      }

      if (isCommand(i)) {
        const command = commands.get(i.data.name);

        if (!command) {
          return ShowMessage({
            content: 'command handler not found',
          });
        }

        //@ts-ignore
        return await command.handle.call(i);
      }
    }
  },
};