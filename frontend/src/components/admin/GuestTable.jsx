/**
 * GuestTable - Tabla de invitados con paginación
 * Muestra cada persona (titular + acompañantes) con fondo de color
 * según su estado individual:
 *   🟢 Verde  → confirmó
 *   🔴 Rojo   → rechazó
 *   🟡 Amarillo → pendiente / sin datos
 */
import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Copy, Check, Pencil, MessageCircle, StickyNote } from 'lucide-react';

const INVITE_BASE = 'https://invitacion.jonathanvera.dev';

const MESSAGE_TEMPLATE = url => `Hola!

Nos emociona muchísimo compartir con ustedes esta nueva etapa de nuestra historia juntos. Queremos invitarlos de manera muy especial a la celebración de nuestra boda el próximo 8 de agosto.

Con mucho amor, hemos preparado una invitación digital donde encontrarán toda la información del evento, código de vestimenta y el espacio para confirmar sus cupos:

${url}

¡Los esperamos para celebrar juntos! 🤍

*Jonathan & Duniechka*`;

function parseList(str) {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

/**
 * Estado individual de cada persona
 */
function getPersonStatus(name, confirmados, confirmo) {
  if (confirmo === 'no') return 'declined';
  if (confirmo === 'si') {
    return confirmados.includes(name) ? 'confirmed' : 'declined';
  }
  return 'pending';
}

const BG_CLASSES = {
  confirmed: 'bg-green-200 dark:bg-green-900/50',
  declined: 'bg-red-200 dark:bg-red-900/50',
  pending: 'bg-amber-200 dark:bg-amber-900/50',
};

const BORDER_CLASSES = {
  confirmed: 'border-l-green-600',
  declined: 'border-l-red-500',
  pending: 'border-l-amber-600',
};

const TEXT_CLASSES = {
  confirmed: 'text-green-800 dark:text-green-200',
  declined: 'text-red-800 dark:text-red-200 line-through',
  pending: 'text-amber-800 dark:text-amber-200',
};

function PersonBadge({ name, status }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border-l-4 ${BG_CLASSES[status]} ${BORDER_CLASSES[status]} ${TEXT_CLASSES[status]}`}>
      {status === 'confirmed' && '✓ '}
      {status === 'declined' && '✗ '}
      {status === 'pending' && '? '}
      {name}
    </span>
  );
}

function CopyMessageButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async e => {
    e.stopPropagation();
    const text = MESSAGE_TEMPLATE(url);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('textarea');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className='p-1.5 rounded-md transition-colors hover:bg-surface-container-low text-secondary hover:text-primary'
      title='Copiar mensaje'>
      {copied ? (
        <Check className='w-3.5 h-3.5 text-success' />
      ) : (
        <MessageCircle className='w-3.5 h-3.5' />
      )}
    </button>
  );
}

function CopyButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async e => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className='p-1.5 rounded-md transition-colors hover:bg-surface-container-low text-secondary hover:text-primary'
      title='Copiar URL'>
      {copied ? (
        <Check className='w-3.5 h-3.5 text-success' />
      ) : (
        <Copy className='w-3.5 h-3.5' />
      )}
    </button>
  );
}

export function GuestTable({ guests, onRowClick, onEdit }) {
  const getCategoriaBadge = cat => {
    const badges = {
      'Familia del Novio': 'primary',
      'Familia de la Novia': 'default',
      'Amigos del novio': 'default',
      'Amigos de la novia': 'default',
    };
    return badges[cat] || 'default';
  };

  const confirmoVariant = confirmo => {
    if (confirmo === 'no') return 'error';
    if (confirmo === 'si') return 'success';
    return 'default';
  };

  const confirmoLabel = confirmo => {
    if (confirmo === 'no') return 'Rechazado';
    if (confirmo === 'si') return 'Completado';
    return 'Pendiente';
  };

  return (
    <div className='bg-surface-container-lowest rounded-xl overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-surface-container-low text-sm text-secondary'>
            <tr>
              <th className='text-left p-4 font-medium'>Invitados</th>
              <th className='text-left p-4 font-medium'>Categoría</th>
              <th className='text-left p-4 font-medium'>Estado</th>
              <th className='text-left p-4 font-medium'>Notas</th>
              <th className='text-left p-4 font-medium'>Invitación</th>
              <th className='text-right p-4 font-medium w-16'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-surface-container-low'>
            {guests.map(inv => {
              const comps = parseList(inv.acompanantes);
              const confirmados = parseList(inv.confirmados);
              // Todas las personas: titular + acompañantes
              const personas = [
                { name: inv.nombre, isMain: true },
                ...comps.map(c => ({ name: c, isMain: false })),
              ];

              return (
                <tr
                  key={inv.id}
                  className='transition-colors cursor-pointer hover:bg-surface-container-low/50'
                  onClick={() => onRowClick?.(inv)}>
                  <td className='p-4'>
                    <div className='flex flex-wrap gap-1.5'>
                      {personas.map((p, i) => (
                        <PersonBadge
                          key={i}
                          name={p.name}
                          status={getPersonStatus(p.name, confirmados, inv.confirmo)}
                        />
                      ))}
                    </div>
                  </td>
                  <td className='p-4'>
                    <Badge variant={getCategoriaBadge(inv.categoria)}>
                      {inv.categoria}
                    </Badge>
                  </td>
                  <td className='p-4'>
                    <Badge variant={confirmoVariant(inv.confirmo)}>
                      {confirmoLabel(inv.confirmo)}
                    </Badge>
                  </td>
                  <td className='p-4'>
                    {inv.restricciones ? (
                      <div className='flex items-start gap-1.5 max-w-[200px]'>
                        <StickyNote className='w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0' />
                        <span className='text-sm text-primary/80 break-words leading-snug'>
                          {inv.restricciones}
                        </span>
                      </div>
                    ) : (
                      <span className='text-xs text-secondary/50'>—</span>
                    )}
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center gap-1.5'>
                      <code className='text-xs bg-surface-container-low px-2 py-1 rounded font-mono'>
                        {inv.codigo}
                      </code>
                      <CopyButton url={`${INVITE_BASE}/${inv.codigo}`} />
                    </div>
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <CopyMessageButton url={`${INVITE_BASE}/${inv.codigo}`} />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onEdit?.(inv);
                        }}
                        className='p-1.5 rounded-md transition-colors hover:bg-surface-container-low text-secondary hover:text-primary'
                        title='Editar invitado'>
                        <Pencil className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
