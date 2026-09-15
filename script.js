/**
 * SS Harmonia (corpo & mente)
 * Interatividade, Animações e Validações
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. NAVEGAÇÃO & MENU MOBILE (HAMBÚRGUER)
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const mainHeader = document.getElementById('main-header');

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
    menuOverlay.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      menuOverlay.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Fechar menu ao clicar em qualquer link de navegação
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // =========================================================================
  // 2. HEADER SCROLL EFFECT (BLUR / ELEVAÇÃO) & ACTIVE NAV LINK
  // =========================================================================
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ScrollSpy simples para destacar o link ativo no menu
  const sections = document.querySelectorAll('section[id]');
  const handleScrollSpy = () => {
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  // =========================================================================
  // 3. ANIMAÇÕES AO ROLAR (INTERSECTION OBSERVER)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback para navegadores legados
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // =========================================================================
  // 4. INTEGRAÇÃO DOS CARDS DE SERVIÇO COM O FORMULÁRIO
  // =========================================================================
  const serviceButtons = document.querySelectorAll('[data-service]');
  const selectServico = document.getElementById('tipo_servico');

  serviceButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const serviceName = button.getAttribute('data-service');
      if (selectServico && serviceName) {
        // Encontra a opção correspondente ou mais próxima
        for (let i = 0; i < selectServico.options.length; i++) {
          const optionText = selectServico.options[i].text.toLowerCase();
          const optionVal = selectServico.options[i].value.toLowerCase();
          const target = serviceName.toLowerCase();

          if (optionText.includes(target) || target.includes(optionText) || optionVal.includes(target)) {
            selectServico.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // =========================================================================
  // 5. MÁSCARA INTELIGENTE DE TELEFONE (PADRÃO BRASIL)
  // =========================================================================
  const telefoneInput = document.getElementById('telefone');

  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }

      e.target.value = value;
    });
  }

  // =========================================================================
  // 6. VALIDAÇÃO DO FORMULÁRIO & ENVIO PARA WHATSAPP
  // =========================================================================
  const form = document.getElementById('agendamento-form');
  const nomeInput = document.getElementById('nome');
  const dataInput = document.getElementById('data_preferencia');
  const pessoasInput = document.getElementById('qtd_pessoas');
  const mensagemInput = document.getElementById('mensagem');
  const formFeedback = document.getElementById('form-feedback');

  const erroNome = document.getElementById('erro-nome');
  const erroTelefone = document.getElementById('erro-telefone');
  const erroServico = document.getElementById('erro-servico');

  // Limpar erros ao digitar
  [nomeInput, telefoneInput, selectServico].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        const errSpan = input.parentElement.querySelector('.error-msg');
        if (errSpan) errSpan.textContent = '';
      });
    }
  });

  const validateForm = () => {
    let isValid = true;

    // Validar Nome
    if (!nomeInput.value.trim() || nomeInput.value.trim().length < 3) {
      nomeInput.classList.add('is-invalid');
      erroNome.textContent = 'Por favor, insira seu nome completo (mínimo 3 letras).';
      isValid = false;
    } else {
      nomeInput.classList.remove('is-invalid');
      erroNome.textContent = '';
    }

    // Validar Telefone
    const cleanPhone = telefoneInput.value.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      telefoneInput.classList.add('is-invalid');
      erroTelefone.textContent = 'Por favor, insira um telefone válido com DDD.';
      isValid = false;
    } else {
      telefoneInput.classList.remove('is-invalid');
      erroTelefone.textContent = '';
    }

    // Validar Serviço
    if (!selectServico.value) {
      selectServico.classList.add('is-invalid');
      erroServico.textContent = 'Por favor, escolha uma modalidade de atendimento.';
      isValid = false;
    } else {
      selectServico.classList.remove('is-invalid');
      erroServico.textContent = '';
    }

    return isValid;
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Por favor, preencha os campos obrigatórios assinalados acima.';
        return;
      }

      // Preparação dos dados para mensagem no WhatsApp
      const nome = nomeInput.value.trim();
      const telefone = telefoneInput.value.trim();
      const servico = selectServico.options[selectServico.selectedIndex].text;
      const dataVal = dataInput.value ? new Date(dataInput.value + 'T00:00:00').toLocaleDateString('pt-BR') : 'A combinar';
      const pessoas = pessoasInput.value.trim() || 'Não informado';
      const mensagem = mensagemInput.value.trim() || 'Sem observações adicionais';

      const textoWhatsApp = 
`🌿 *Olá, SS Harmonia!*
Gostaria de agendar uma sessão / solicitar orçamento:

👤 *Nome:* ${nome}
📱 *Telefone:* ${telefone}
💆‍♀️ *Modalidade:* ${servico}
📅 *Data pretendida:* ${dataVal}
👥 *Qtd. Pessoas:* ${pessoas}
💬 *Detalhes:* ${mensagem}

_Aguardando seu retorno para confirmação!_`;

      const numeroOficial = '5541984623958';
      const urlWhatsApp = `https://wa.me/${numeroOficial}?text=${encodeURIComponent(textoWhatsApp)}`;

      // Feedback visual ao usuário
      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = '✨ <strong>Perfeito!</strong> Seus dados foram validados. Redirecionando para o WhatsApp da SS Harmonia...';

      // Abre o WhatsApp
      setTimeout(() => {
        window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
      }, 700);
    });
  }
});
