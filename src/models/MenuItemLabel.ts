/**
 * Menu item label interface, used in navbar.
 */
export interface MenuItemLabel {
  /**
   * Default title of label
   */
  name: string;

  /**
   * Path / link to page
   */
  path: string;

  /**
   * Localization ID.
   */
  id?: string;
}
