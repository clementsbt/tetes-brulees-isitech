import { db } from './db';
import { sendNewEventNotification, sendNewParticipantNotification } from './email';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tetes-brulees.fr';

/**
 * Notifie les utilisateurs qui veulent être prévenus d'une nouvelle sortie
 */
export async function notifyNewEvent(eventTitle: string, eventDate: string, eventLocation: string) {
  // Récupère tous les users qui ont coché la case
  const usersToNotify = await db.user.findMany({
    where: {
      notifyOnNewEvent: true,
      validated: true,
    },
    select: { email: true, name: true },
  });

  console.log(`[NOTIF] Nouvelle sortie: ${usersToNotify.length} destinataires`);

  for (const user of usersToNotify) {
    if (!user.email) continue;
    try {
      await sendNewEventNotification(
        user.email,
        user.name || 'Membre',
        eventTitle,
        eventDate,
        eventLocation,
        `${BASE_URL}/sorties-club`
      );
    } catch (err) {
      console.error(`[NOTIF] Erreur pour ${user.email}:`, err);
    }
  }
}

/**
 * Notifie le créateur et tous les participants d'un événement
 * qu'un nouveau membre s'est inscrit
 */
export async function notifyNewParticipantToEvent(
  eventId: string,
  eventTitle: string,
  eventDate: string,
  participantName: string
) {
  // Récupérer l'événement avec ses participants
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      createdBy: {
        select: { email: true, name: true },
      },
      participations: {
        include: {
          user: {
            select: { email: true, name: true },
          },
        },
      },
    },
  });

  if (!event) {
    console.error(`[NOTIF] Événement non trouvé: ${eventId}`);
    return;
  }

  // Collecter tous les emails uniques (créateur + participants)
  const recipients = new Map<string, { name: string }>();

  // Ajouter le créateur
  if (event.createdBy?.email) {
    recipients.set(event.createdBy.email, { name: event.createdBy.name || 'Créateur' });
  }

  // Ajouter les participants
  for (const p of event.participations) {
    if (p.user?.email) {
      recipients.set(p.user.email, { name: p.user.name || 'Participant' });
    }
  }

  console.log(`[NOTIF] Nouveau participant pour "${eventTitle}": ${recipients.size} destinataires`);

  // Envoyer les notifications
  for (const [email, data] of recipients) {
    try {
      await sendNewParticipantNotification(
        email,
        data.name,
        participantName,
        eventTitle,
        eventDate
      );
    } catch (err) {
      console.error(`[NOTIF] Erreur pour ${email}:`, err);
    }
  }
}

/**
 * Notifie le créateur et les autres participants qu'un membre s'est désinscrit
 */
export async function notifyParticipantLeft(
  eventId: string,
  eventTitle: string,
  eventDate: string,
  participantName: string
) {
  // Récupérer l'événement avec ses participants
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      createdBy: {
        select: { email: true, name: true },
      },
      participations: {
        include: {
          user: {
            select: { email: true, name: true },
          },
        },
      },
    },
  });

  if (!event) {
    console.error(`[NOTIF] Événement non trouvé: ${eventId}`);
    return;
  }

  // Collecter tous les emails uniques (créateur + participants restants)
  const recipients = new Map<string, { name: string }>();

  // Ajouter le créateur
  if (event.createdBy?.email) {
    recipients.set(event.createdBy.email, { name: event.createdBy.name || 'Créateur' });
  }

  // Ajouter les participants restants
  for (const p of event.participations) {
    if (p.user?.email) {
      recipients.set(p.user.email, { name: p.user.name || 'Participant' });
    }
  }

  console.log(`[NOTIF] Participant parti de "${eventTitle}": ${recipients.size} destinataires`);

  // Envoyer les notifications
  for (const [email, data] of recipients) {
    try {
      await sendNewParticipantNotification(
        email,
        data.name,
        participantName + ' (désinscription)',
        eventTitle,
        eventDate
      );
    } catch (err) {
      console.error(`[NOTIF] Erreur pour ${email}:`, err);
    }
  }
}