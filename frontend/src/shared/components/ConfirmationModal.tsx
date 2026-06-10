import {
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/forms/Button";

type Props = {
  open: boolean;
  loading?: boolean;

  title: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  confirmColor?: "blue" | "red" | "green" | "yellow";
  icon?: IconDefinition;

  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
};

export default function ConfirmationModal({
  open,
  loading = false,

  title,
  message,

  confirmText = "Confirmar",
  cancelText = "Cancelar",

  confirmColor = "blue",
  icon = faTriangleExclamation,

  onConfirm,
  onCancel,
  onClose,
}: Props) {
  return (
    <Modal
      abierto={open}
      onClose={loading ? () => {} : (onClose ?? onCancel)}
      size="sm"
      gradient
    >
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <FontAwesomeIcon
              icon={icon}
              className="text-lg"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            label={cancelText}
            color="red"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          />

          <Button
            label={loading ? "Procesando..." : confirmText}
            color="green"
            loading={loading}
            disabled={loading}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Modal>
  );
}