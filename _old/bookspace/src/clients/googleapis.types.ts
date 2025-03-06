export type CalendarList = {
  kind: "calendar#calendarList";
  etag: string;
  nextSyncToken: string;
  items: CalendarListEntry[];
};

export type CalendarListEntry = {
  "kind": "calendar#calendarListEntry";
  "etag": string;
  "id": string;
  "summary": string;
  "description": string;
  "location": string;
  "timeZone": string;
  "summaryOverride": string;
  "colorId": string;
  "backgroundColor": string;
  "foregroundColor": string;
  "hidden": boolean;
  "selected": boolean;
  "accessRole": "freeBusyReader" | "reader" | "writer" | "owner";
  "defaultReminders": [
    {
      "method": string;
      "minutes": number;
    },
  ];
  "notificationSettings": {
    "notifications": [
      {
        "type":
          | "eventCreation"
          | "eventChange"
          | "eventCancellation"
          | "eventResponse"
          | "agenda";
        "method": "email";
      },
    ];
  };
  "primary": boolean;
  "deleted": boolean;
  "conferenceProperties": {
    allowedConferenceSolutionTypes: (
      | "eventHangout"
      | "eventNamedHangout"
      | "hangoutsMeet"
    )[];
  };
};
