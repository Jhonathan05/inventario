import html2pdf from 'html2pdf.js';

export const generateTicketReport = (ticket, currentUser) => {
    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    const formatTime = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };
    const getInitials = (name) => {
        if (!name) return 'NA';
        const p = name.trim().split(' ');
        return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
    };
    const pColor = (p) => p === 'ALTA' || p === 'URGENTE' ? '#ef4444' : p === 'MEDIA' ? '#eab308' : '#22c55e';

    const trazasRows = (ticket.trazas || []).map(t => {
        const bgBadge = t.tipoTraza === 'CAMBIO_ESTADO' ? '#dbeafe' : t.tipoTraza === 'CREACION' ? '#d1fae5' : '#fef3c7';
        const txtBadge = t.tipoTraza === 'CAMBIO_ESTADO' ? '#1e40af' : t.tipoTraza === 'CREACION' ? '#065f46' : '#92400e';
        const label = t.tipoTraza === 'CAMBIO_ESTADO' ? `${t.estadoAnterior || ''} → ${t.estadoNuevo}` : t.tipoTraza;
        return `
        <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;">
                <div style="font-weight:700;font-size:10px;color:#1f2937;">${formatDate(t.creadoEn)}</div>
                <div style="font-size:9px;color:#6b7280;">${formatTime(t.creadoEn)}</div>
            </td>
            <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:10px;color:#1f2937;">${t.creadoPor?.nombre || 'SISTEMA'}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;">
                <span style="display:inline-block;padding:2px 8px;border-radius:4px;background:${bgBadge};color:${txtBadge};font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
            </td>
            <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:10px;color:#6b7280;line-height:1.4;">${t.comentario || ''}</td>
        </tr>`;
    }).join('');

    const activoBlock = ticket.activo ? `
        <div style="background:#ffffff;padding:12px;border-radius:6px;border:1px solid #e5e7eb;margin-top:14px;">
            <div style="font-size:9px;font-weight:700;color:#255dad;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">🖥 Activo Vinculado</div>
            <div style="font-size:11px;font-weight:700;color:#1f2937;margin-bottom:2px;">PLACA: ${ticket.activo.placa || 'N/A'} | SERIAL: ${ticket.activo.serial || 'N/A'}</div>
            <div style="font-size:9px;color:#6b7280;text-transform:uppercase;">${ticket.activo.marca || ''} ${ticket.activo.modelo || ''} ${ticket.activo.nombreEquipo ? '(' + ticket.activo.nombreEquipo + ')' : ''}</div>
        </div>` : '';

    const solucionBlock = (ticket.solucionTecnica || ticket.conclusiones) ? `
        <div style="margin-top:24px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                <div style="width:20px;height:1px;background:#255dad;"></div>
                <span style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:2px;">Solución Técnica y Cierre</span>
            </div>
            <div style="background:#ffffff;border:1px solid #e5e7eb;padding:16px;border-radius:8px;">
                ${ticket.solucionTecnica ? `
                <div style="margin-bottom:10px;">
                    <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Diagnóstico y Pasos Realizados</div>
                    <p style="font-size:11px;color:#1f2937;line-height:1.5;margin:0;white-space:pre-wrap;">${ticket.solucionTecnica}</p>
                </div>` : ''}
                ${ticket.conclusiones ? `
                <div ${ticket.solucionTecnica ? 'style="border-top:1px solid #f0f0f0;padding-top:10px;margin-top:6px;"' : ''}>
                    <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Conclusiones Finales</div>
                    <p style="font-size:11px;color:#1f2937;line-height:1.5;margin:0;font-weight:500;white-space:pre-wrap;">${ticket.conclusiones}</p>
                </div>` : ''}
            </div>
        </div>` : '';

    const html = `
    <div id="ticket-pdf-root" style="width:794px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#1f2937;background:#ffffff;box-sizing:border-box;">

        <!-- HEADER -->
        <div style="padding:36px 36px 24px;border-bottom:1px solid #e5e7eb;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
                <div>
                    <div style="display:inline-block;padding:3px 10px;border-radius:12px;background:#cbe7f5;color:#3c5561;font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">
                        Reporte de Ciclo de Vida
                    </div>
                    <div style="font-size:26px;font-weight:800;color:#1f2937;letter-spacing:-0.5px;margin-bottom:4px;">${(ticket.asunto || 'REQUERIMIENTO').toUpperCase()}</div>
                    <div style="color:#255dad;font-weight:600;font-size:14px;">Ticket ID: #${ticket.id}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Fecha de Impresión</div>
                    <div style="font-weight:500;font-size:12px;color:#1f2937;">${formatDate(new Date())}</div>
                    <div style="color:#6b7280;font-size:11px;">${formatTime(new Date())}</div>
                </div>
            </div>

            <!-- BENTO GRID -->
            <div style="display:flex;gap:10px;">
                <div style="flex:1;background:#f3f4f6;padding:12px;border-radius:6px;">
                    <div style="font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Prioridad</div>
                    <div style="display:flex;align-items:center;gap:5px;">
                        <div style="width:7px;height:7px;border-radius:50%;background:${pColor(ticket.prioridad)};"></div>
                        <span style="font-weight:700;font-size:12px;text-transform:uppercase;">${ticket.prioridad || 'N/A'}</span>
                    </div>
                </div>
                <div style="flex:1;background:#f3f4f6;padding:12px;border-radius:6px;">
                    <div style="font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Estado</div>
                    <div style="font-weight:700;font-size:12px;text-transform:uppercase;">${ticket.estado || 'N/A'}</div>
                </div>
                <div style="flex:1;background:#f3f4f6;padding:12px;border-radius:6px;">
                    <div style="font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Tipo</div>
                    <div style="font-weight:700;font-size:12px;text-transform:uppercase;">${ticket.tipo || 'N/A'}</div>
                </div>
                <div style="flex:1;background:#f3f4f6;padding:12px;border-radius:6px;border-left:3px solid #255dad;">
                    <div style="font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Analista Asignado</div>
                    <div style="font-weight:700;font-size:10px;text-transform:uppercase;">${ticket.asignadoA?.nombre || 'SIN ASIGNAR'}</div>
                </div>
            </div>
        </div>

        <!-- BODY -->
        <div style="padding:28px 36px 36px;">

            <!-- TWO COLUMNS -->
            <div style="display:flex;gap:24px;">
                <!-- LEFT -->
                <div style="flex:1.4;">
                    <!-- Info General -->
                    <div style="margin-bottom:20px;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                            <div style="width:20px;height:1px;background:#255dad;"></div>
                            <span style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:2px;">Información General del Caso</span>
                        </div>
                        <div style="display:flex;gap:16px;">
                            <div style="flex:1;">
                                <div style="font-size:8px;color:#6b7280;text-transform:uppercase;font-weight:500;">Fecha de Creación</div>
                                <div style="font-weight:600;font-size:12px;margin-top:2px;">${formatDate(ticket.creadoEn)}, ${formatTime(ticket.creadoEn)}</div>
                            </div>
                            <div style="flex:1;">
                                <div style="font-size:8px;color:#6b7280;text-transform:uppercase;font-weight:500;">Ubicación</div>
                                <div style="font-weight:600;font-size:12px;margin-top:2px;">${ticket.activo?.ubicacion || 'Sede Principal'}</div>
                            </div>
                        </div>
                    </div>
                    <!-- Descripción -->
                    <div>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                            <div style="width:20px;height:1px;background:#255dad;"></div>
                            <span style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:2px;">Descripción del Requerimiento</span>
                        </div>
                        <div style="background:#f3f4f6;padding:16px;border-radius:8px;">
                            <p style="font-style:italic;color:#1f2937;line-height:1.6;margin:0;font-size:11px;white-space:pre-wrap;">"${ticket.descripcion || 'Sin descripción'}"</p>
                        </div>
                    </div>
                </div>

                <!-- RIGHT: Solicitante -->
                <div style="flex:1;">
                    <div style="background:#eaeff1;padding:16px;border-radius:8px;">
                        <div style="font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Información del Solicitante</div>
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                            <div style="width:40px;height:40px;border-radius:50%;background:#d7e2ff;display:flex;align-items:center;justify-content:center;color:#0f509f;font-weight:700;font-size:14px;line-height:40px;text-align:center;">
                                ${getInitials(ticket.funcionario?.nombre)}
                            </div>
                            <div>
                                <div style="font-weight:700;font-size:11px;text-transform:uppercase;color:#1f2937;">${ticket.funcionario?.nombre || 'SIN ASIGNAR'}</div>
                                <div style="font-size:9px;color:#6b7280;">ID: ${ticket.funcionario?.identificacion || ticket.funcionario?.cedula || 'N/A'}</div>
                            </div>
                        </div>
                        <div style="border-top:1px solid #ccc;padding-top:8px;">
                            <div style="margin-bottom:6px;">
                                <div style="font-size:8px;color:#6b7280;text-transform:uppercase;">Dep. / Área</div>
                                <div style="font-size:10px;font-weight:700;text-transform:uppercase;margin-top:1px;color:#1f2937;">${ticket.funcionario?.area || 'NO ESPECIFICADA'}</div>
                            </div>
                            <div>
                                <div style="font-size:8px;color:#6b7280;text-transform:uppercase;">Cargo</div>
                                <div style="font-size:10px;font-weight:700;text-transform:uppercase;margin-top:1px;color:#1f2937;">${ticket.funcionario?.cargo || 'NO ESPECIFICADO'}</div>
                            </div>
                        </div>
                        ${activoBlock}
                    </div>
                </div>
            </div>

            ${solucionBlock}

            <!-- TRAZABILIDAD -->
            <div style="margin-top:24px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:12px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:20px;height:1px;background:#255dad;"></div>
                        <span style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:2px;">Trazabilidad de Eventos</span>
                    </div>
                    <span style="font-size:9px;color:#6b7280;">Total: ${ticket.trazas?.length || 0} registros</span>
                </div>
                <div style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#e5e7eb;">
                                <th style="padding:10px 14px;text-align:left;font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Fecha</th>
                                <th style="padding:10px 14px;text-align:left;font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Usuario</th>
                                <th style="padding:10px 14px;text-align:left;font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Acción/Estado</th>
                                <th style="padding:10px 14px;text-align:left;font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Observación</th>
                            </tr>
                        </thead>
                        <tbody>${trazasRows}</tbody>
                    </table>
                </div>
            </div>

            <!-- FIRMAS -->
            <div style="margin-top:50px;display:flex;justify-content:space-between;padding:0 16px;">
                <div style="text-align:center;width:220px;">
                    <div style="border-top:1px solid #374151;margin-bottom:6px;"></div>
                    <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1f2937;">Firma del Analista Responsable</div>
                    <div style="font-size:8px;color:#6b7280;margin-top:3px;">${ticket.asignadoA?.nombre || (currentUser?.nombre || 'Analista Responsable')}</div>
                </div>
                <div style="text-align:center;width:220px;">
                    <div style="border-top:1px solid #374151;margin-bottom:6px;"></div>
                    <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1f2937;">Recibe a Satisfacción</div>
                    <div style="font-size:8px;color:#6b7280;margin-top:3px;">${ticket.funcionario?.nombre || 'Funcionario Solicitante'}</div>
                </div>
            </div>
        </div>
    </div>`;

    // Crear contenedor oculto
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
    container.innerHTML = html;
    document.body.appendChild(container);

    const element = container.querySelector('#ticket-pdf-root');

    html2pdf().set({
        margin:      [0, 0, 0, 0],
        filename:    `Reporte_Caso_${ticket.id}.pdf`,
        image:       { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, scrollY: 0, windowWidth: 794 },
        jsPDF:       { unit: 'px', format: [794, 1123], orientation: 'portrait', hotfixes: ['px_scaling'] }
    }).from(element).save().then(() => {
        document.body.removeChild(container);
    }).catch(err => {
        console.error('Error generando PDF:', err);
        document.body.removeChild(container);
        alert('Error al generar el PDF. Revisa la consola.');
    });
};
