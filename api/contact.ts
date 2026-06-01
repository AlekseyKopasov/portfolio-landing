import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Имя обязательно').max(100),
  phone: z
    .string()
    .trim()
    .min(10, 'Телефон слишком короткий')
    .max(30)
    .regex(/^[\d\s+()-]+$/, 'Некорректный телефон'),
  email: z.string().trim().email('Некорректный email').max(200),
  comment: z.string().trim().min(1, 'Комментарий обязателен').max(5000),
  website: z.string().optional(),
});

function getMailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM || !MAIL_TO) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    from: MAIL_FROM,
    to: MAIL_TO,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      message: parsed.error.issues[0]?.message ?? 'Проверьте данные формы',
    });
  }

  const { name, phone, email, comment, website } = parsed.data;

  if (website?.trim()) {
    return res.status(200).json({ ok: true });
  }

  const mailConfig = getMailConfig();

  if (!mailConfig) {
    return res.status(500).json({
      error: 'Mail not configured',
      message: 'Почта не настроена на сервере. Напишите через контакты на странице.',
    });
  }

  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: mailConfig.auth,
  });

  const ownerText = [
    'Новое сообщение с лендинга',
    '',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Email: ${email}`,
    '',
    'Комментарий:',
    comment,
  ].join('\n');

  const userText = [
    `Здравствуйте, ${name}!`,
    '',
    'Мы получили ваше сообщение:',
    '',
    `Телефон: ${phone}`,
    `Email: ${email}`,
    '',
    'Комментарий:',
    comment,
    '',
    'Ответим при первой возможности.',
    '',
    '— Алексей Копасов',
  ].join('\n');

  try {
    await transporter.sendMail({
      from: mailConfig.from,
      to: mailConfig.to,
      replyTo: email,
      subject: `[Portfolio] Сообщение от ${name}`,
      text: ownerText,
    });

    await transporter.sendMail({
      from: mailConfig.from,
      to: email,
      subject: 'Копия вашего сообщения — Алексей Копасов',
      text: userText,
    });

    return res.status(200).json({ ok: true, message: 'Sent' });
  } catch (error) {
    console.error('Contact mail error:', error);
    return res.status(500).json({
      error: 'Send failed',
      message: 'Не удалось отправить письмо. Попробуйте позже или напишите на email из контактов.',
    });
  }
}
