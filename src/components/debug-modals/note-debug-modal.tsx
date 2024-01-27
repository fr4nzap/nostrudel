import { useCallback, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Flex, Button } from "@chakra-ui/react";
import { ModalProps } from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import { getContentTagRefs, getThreadReferences } from "../../helpers/nostr/events";
import { NostrEvent } from "../../types/nostr-event";
import RawJson from "./raw-json";
import RawValue from "./raw-value";
import RawPre from "./raw-pre";
import { getSharableEventAddress } from "../../helpers/nip19";
import { usePublishEvent } from "../../providers/global/publish-provider";

export default function NoteDebugModal({ event, ...props }: { event: NostrEvent } & Omit<ModalProps, "children">) {
  const publish = usePublishEvent();
  const [loading, setLoading] = useState(false);
  const broadcast = useCallback(async () => {
    setLoading(true);
    await publish("Broadcast", event);
    setLoading(false);
  }, []);

  return (
    <Modal size="6xl" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p="4">
          <Flex gap="2" direction="column">
            <RawValue heading="Event Id" value={event.id} />
            <RawValue heading="NIP-19 Encoded Id" value={nip19.noteEncode(event.id)} />
            <RawValue heading="NIP-19 Pointer" value={getSharableEventAddress(event)} />
            <RawPre heading="Content" value={event.content} />
            <RawJson heading="JSON" json={event} />
            <RawJson heading="Thread Tags" json={getThreadReferences(event)} />
            <RawJson heading="Tags referenced in content" json={getContentTagRefs(event.content, event.tags)} />
            {/* TODO: extract this out  */}
            <Button onClick={broadcast} ml="auto" colorScheme="primary" isLoading={loading}>
              Broadcast
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
