import {
  faArrowRotateRight,
  faRightFromBracket,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/forms/Button";

type Props = {
  open: boolean;
  loading?: boolean;
  onRenew: () => void;
  onLogout: () => void;
  onClose: () => void;
};

export default function SessionRenewModal({
  open,
  loading = false,
  onRenew,
  onLogout,
  onClose,
}: Props) {
  return (
    <Modal
      abierto={open}
      onClose={loading ? () => {} : onClose}
      size="sm"
      gradient
    >
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-lg" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Sesión por expirar
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tu sesión está a punto de caducar.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm leading-relaxed text-gray-600">
            Si no renuevas ahora, se cerrará tu sesión y tendrás que volver a iniciar sesión.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            label="Cerrar sesión"
            icon={faRightFromBracket}
            color="white"
            variant="outline"
            disabled={loading}
            onClick={onLogout}
          />

          <Button
            label={loading ? "Renovando..." : "Renovar sesión"}
            icon={faArrowRotateRight}
            color="blue"
            loading={loading}
            disabled={loading}
            onClick={onRenew}
          />
        </div>
      </div>
    </Modal>
  );
}