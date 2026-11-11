import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { changePassword } from "../../services/authService";
import "./ModalRedefinirSenha.css";

const TAMANHO_MINIMO_SENHA = 8;
const SELETOR_FOCAVEIS = "button:not([disabled]), input:not([disabled])";
const valoresIniciais = {
  senhaAtual: "",
  novaSenha: "",
  confirmarNovaSenha: "",
};

const validarNovaSenha = (senhaAtual, novaSenha) => {
  if (novaSenha === "") {
    return "";
  }
  if (novaSenha === senhaAtual) {
    return "A nova senha deve ser diferente da atual.";
  }
  if (novaSenha.length < TAMANHO_MINIMO_SENHA) {
    return `A nova senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
  }
  return "";
};

const DialogoRedefinirSenha = ({ onFechar }) => {
  const [valores, setValores] = useState(valoresIniciais);
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [erroSenhaAtual, setErroSenhaAtual] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const dialogoRef = useRef(null);
  const primeiroCampoRef = useRef(null);
  const sucessoRef = useRef(null);

  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    primeiroCampoRef.current?.focus();

    return () => {
      document.body.style.overflow = overflowAnterior;
      elementoAnterior?.focus();
    };
  }, []);

  useEffect(() => {
    if (concluido) {
      sucessoRef.current?.focus();
    }
  }, [concluido]);

  const erroNovaSenha = validarNovaSenha(valores.senhaAtual, valores.novaSenha);
  const confirmacaoPreenchida = valores.confirmarNovaSenha !== "";
  const senhasCoincidem = valores.novaSenha === valores.confirmarNovaSenha;
  const podeEnviar =
    !salvando &&
    valores.senhaAtual !== "" &&
    valores.novaSenha !== "" &&
    erroNovaSenha === "" &&
    confirmacaoPreenchida &&
    senhasCoincidem;

  const propsSenha = {
    type: mostrarSenhas ? "text" : "password",
    spellCheck: false,
    autoCapitalize: "off",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValores((atual) => ({ ...atual, [name]: value }));
    setErroEnvio("");
    if (name === "senhaAtual") {
      setErroSenhaAtual("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      if (!salvando) {
        onFechar();
      }
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focaveis = dialogoRef.current.querySelectorAll(SELETOR_FOCAVEIS);

    if (focaveis.length === 0) {
      return;
    }

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!podeEnviar) {
      return;
    }

    setSalvando(true);
    setErroEnvio("");
    setErroSenhaAtual("");

    try {
      await changePassword({
        senhaAtual: valores.senhaAtual,
        novaSenha: valores.novaSenha,
      });
      setValores(valoresIniciais);
      setConcluido(true);
    } catch (erroRequisicao) {
      const campo =
        erroRequisicao.response?.status === 400
          ? erroRequisicao.response.data?.campo
          : undefined;

      if (campo === "senhaAtual") {
        setErroSenhaAtual("A senha atual está incorreta.");
      } else {
        setErroEnvio("Não foi possível alterar a senha. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        ref={dialogoRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="redefinir-senha-titulo"
        onKeyDown={handleKeyDown}
      >
        <div className="modal__header">
          <h2 className="modal__title" id="redefinir-senha-titulo">
            Redefinir senha
          </h2>
          <button
            type="button"
            className="modal__close"
            aria-label="Fechar"
            onClick={onFechar}
            disabled={salvando}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="modal__body">
          {concluido ? (
            <div ref={sucessoRef} className="modal__success" tabIndex={-1}>
              <h3 className="modal__success-title">Senha alterada</h3>
              <p className="modal__success-text">
                Sua senha foi alterada com sucesso.
              </p>
              <button
                type="button"
                className="btn-pill btn-pill--blue modal__submit"
                onClick={onFechar}
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              <p className="modal__subtitle">
                Informe a senha atual e escolha uma nova senha.
              </p>

              <form className="modal__form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                  <label
                    className="form-field__label"
                    htmlFor="redefinir-senha-atual"
                  >
                    Senha atual
                  </label>
                  <input
                    ref={primeiroCampoRef}
                    className="form-field__input"
                    id="redefinir-senha-atual"
                    name="senhaAtual"
                    autoComplete="current-password"
                    value={valores.senhaAtual}
                    onChange={handleChange}
                    aria-invalid={Boolean(erroSenhaAtual)}
                    aria-describedby={
                      erroSenhaAtual ? "redefinir-senha-atual-erro" : undefined
                    }
                    {...propsSenha}
                  />
                  {erroSenhaAtual && (
                    <p
                      className="form-field__error"
                      id="redefinir-senha-atual-erro"
                    >
                      {erroSenhaAtual}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <label
                    className="form-field__label"
                    htmlFor="redefinir-nova-senha"
                  >
                    Nova senha
                  </label>
                  <input
                    className="form-field__input"
                    id="redefinir-nova-senha"
                    name="novaSenha"
                    autoComplete="new-password"
                    value={valores.novaSenha}
                    onChange={handleChange}
                    aria-invalid={Boolean(erroNovaSenha)}
                    aria-describedby="redefinir-nova-senha-feedback"
                    {...propsSenha}
                  />
                  <div id="redefinir-nova-senha-feedback" aria-live="polite">
                    {erroNovaSenha ? (
                      <p className="form-field__error">{erroNovaSenha}</p>
                    ) : (
                      <p className="form-field__hint">
                        Mínimo de {TAMANHO_MINIMO_SENHA} caracteres.
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label
                    className="form-field__label"
                    htmlFor="redefinir-confirmar-senha"
                  >
                    Confirmar nova senha
                  </label>
                  <input
                    className="form-field__input"
                    id="redefinir-confirmar-senha"
                    name="confirmarNovaSenha"
                    autoComplete="new-password"
                    value={valores.confirmarNovaSenha}
                    onChange={handleChange}
                    aria-invalid={confirmacaoPreenchida && !senhasCoincidem}
                    aria-describedby="redefinir-confirmar-feedback"
                    {...propsSenha}
                  />
                  <div
                    className="password-feedback-slot"
                    id="redefinir-confirmar-feedback"
                    aria-live="polite"
                  >
                    {confirmacaoPreenchida && (
                      <p
                        className={
                          senhasCoincidem
                            ? "password-feedback password-feedback--ok"
                            : "password-feedback password-feedback--erro"
                        }
                      >
                        <span aria-hidden="true">
                          {senhasCoincidem ? "✓" : "✕"}
                        </span>{" "}
                        {senhasCoincidem
                          ? "As senhas coincidem."
                          : "As senhas não coincidem."}
                      </p>
                    )}
                  </div>
                </div>

                <label className="password-toggle">
                  <input
                    className="password-toggle__input"
                    type="checkbox"
                    checked={mostrarSenhas}
                    onChange={(event) => setMostrarSenhas(event.target.checked)}
                  />
                  <span>Mostrar senhas</span>
                </label>

                {erroEnvio && (
                  <p className="form-banner" role="alert">
                    {erroEnvio}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-pill btn-pill--blue modal__submit"
                  disabled={!podeEnviar}
                >
                  {salvando ? "Alterando..." : "Alterar senha"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Modal para redefinição de senha
 *
 * @example
 * // 1. Crie o estado de controle no componente pai:
 * const [modalAberto, setModalAberto] = useState(false);
 *
 * // 2. No JSX, condicione a exibição (ex: se for o próprio usuário) e chame o modal:
 * {user.id === entidade.id && (
 *   <button onClick={() => setModalAberto(true)}>Redefinir senha</button>
 * )}
 *
 * <ModalRedefinirSenha
 *   aberto={modalAberto}
 *   onFechar={() => setModalAberto(false)}
 * />
 */
const ModalRedefinirSenha = ({ aberto, onFechar }) => {
  if (!aberto) {
    return null;
  }

  return createPortal(
    <DialogoRedefinirSenha onFechar={onFechar} />,
    document.body,
  );
};

export default ModalRedefinirSenha;
